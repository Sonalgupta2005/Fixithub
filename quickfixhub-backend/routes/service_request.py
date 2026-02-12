from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from db.mongodb import (
    service_requests_collection,
    service_offers_collection
)
from services.provider_matcher import get_ranked_providers
from services.offer_service import offer_request_to_providers
from utils.time_utils import now_iso
from services.timeout_service import handle_expired_offers
from bson import ObjectId

service_bp = Blueprint("service", __name__)


# ==========================================================
# CREATE SERVICE REQUEST
# ==========================================================
@service_bp.route("/requests", methods=["POST"])
@login_required
def create_service_request():

    data = request.get_json()

    required_fields = [
        "serviceType",
        "description",
        "address",
        "preferredDate"
    ]

    for field in required_fields:
        if not data.get(field):
            return {
                "success": False,
                "message": f"{field} is required"
            }, 400

    now = now_iso()

    # ---------------------------------------
    # 1️⃣ CREATE REQUEST AS PENDING
    # ---------------------------------------
    request_doc = {
        "user_id": current_user.id,
        "user_name": current_user.name,
        "user_email": current_user.email,
        "user_phone": current_user.phone,
        "service_type": data["serviceType"],
        "description": data["description"],
        "address": data["address"],
        "preferred_date": data["preferredDate"],
        "preferred_time": data.get("preferredTime"),
        "status": "pending",
        "assigned_provider_id": None,
        "offer_round": 0,
        "offer_expires_at": None,
        "created_at": now,
        "updated_at": now
    }

    result = service_requests_collection.insert_one(request_doc)
    request_id = result.inserted_id

    # Fetch full Mongo document (needed by offer_service)
    created_request = service_requests_collection.find_one(
        {"_id": request_id}
    )

    # ---------------------------------------
    # 2️⃣ MATCH PROVIDERS
    # ---------------------------------------
    ranked_providers = get_ranked_providers(
        service_type=created_request["service_type"],
        address=created_request["address"]
    )

    provider_ids = [pid for pid, _ in ranked_providers[:3]]

    # ---------------------------------------
    # 3️⃣ OFFER OR EXPIRE
    # ---------------------------------------
    if provider_ids:
        # Use service layer (handles duplicates safely)
        offer_request_to_providers(created_request, provider_ids)
    else:
        service_requests_collection.update_one(
            {"_id": request_id},
            {"$set": {
                "status": "expired",
                "updated_at": now_iso()
            }}
        )

    # Return fresh updated document
    final_doc = service_requests_collection.find_one(
        {"_id": request_id}
    )

    final_doc["_id"] = str(final_doc["_id"])

    return {
        "success": True,
        "request": final_doc
    }, 201



# ==========================================================
# HOMEOWNER: GET MY REQUESTS
# ==========================================================
@service_bp.route("/my-requests", methods=["GET"])
@login_required
def get_my_requests():

    handle_expired_offers()

    requests = service_requests_collection.find({
        "user_id": current_user.id
    })

    result = []
    for req in requests:
        req["_id"] = str(req["_id"])
        result.append(req)

    return {
        "success": True,
        "requests": result
    }


# ==========================================================
# GET ALL REQUESTS (TEMP)
# ==========================================================
@service_bp.route("/all", methods=["GET"])
@login_required
def get_all_requests():

    requests = service_requests_collection.find()

    result = []
    for req in requests:
        req["_id"] = str(req["_id"])
        result.append(req)

    return {
        "success": True,
        "requests": result
    }


# ==========================================================
# CANCEL SERVICE REQUEST
# ==========================================================
@service_bp.route("/requests/<request_id>/cancel", methods=["POST"])
@login_required
def cancel_service_request(request_id):

    req = service_requests_collection.find_one({
        "_id": ObjectId(request_id)
    })

    if not req:
        return {"success": False, "message": "Not found"}, 404

    if req["user_id"] != current_user.id:
        return {"success": False, "message": "Forbidden"}, 403

    if req["status"] in ["in_progress", "completed", "expired", "cancelled"]:
        return {
            "success": False,
            "message": f"Cannot cancel request in '{req['status']}' state"
        }, 400

    service_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {
            "status": "cancelled",
            "offer_expires_at": None,
            "updated_at": now_iso()
        }}
    )

    # Expire active offers
    service_offers_collection.update_many(
        {
            "request_id": request_id,
            "status": "offered"
        },
        {"$set": {"status": "expired"}}
    )

    updated = service_requests_collection.find_one(
        {"_id": ObjectId(request_id)}
    )

    updated["_id"] = str(updated["_id"])

    return {
        "success": True,
        "request": updated
    }
