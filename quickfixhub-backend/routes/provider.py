from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from db.mongodb import (
    service_requests_collection,
    service_offers_collection
)
from services.provider_matcher import get_ranked_providers
from services.timeout_service import handle_expired_offers
from utils.time_utils import now_iso
from bson import ObjectId

provider_bp = Blueprint("provider", __name__)


# =========================================================
# DASHBOARD SUMMARY
# =========================================================
@provider_bp.route("/dashboard/summary", methods=["GET"])
@login_required
def dashboard_summary():
    if current_user.role != "provider":
        return {"success": False}, 403

    requests = service_requests_collection.find(
        {"assigned_provider_id": current_user.id}
    )

    completed = 0
    active = 0
    earnings = 0

    for req in requests:
        if req["status"] == "completed":
            completed += 1
            earnings += 50
        elif req["status"] in ["accepted", "in_progress"]:
            active += 1

    return {
        "success": True,
        "stats": {
            "jobsCompleted": completed,
            "activeJobs": active,
            "rating": 4.9,
            "earnings": earnings
        }
    }


# =========================================================
# AVAILABLE JOBS
# =========================================================
@provider_bp.route("/jobs/available", methods=["GET"])
@login_required
def available_jobs():

    if current_user.role != "provider":
        return {"success": False}, 403

    handle_expired_offers()

    offers = list(service_offers_collection.find({
        "provider_id": current_user.id,
        "status": "offered"
    }))

    if not offers:
        return {"success": True, "jobs": []}

    request_ids = [
        ObjectId(o["request_id"]) for o in offers
    ]

    requests = service_requests_collection.find({
        "_id": {"$in": request_ids}
    })

    jobs = []
    for req in requests:
        req["_id"] = str(req["_id"])
        jobs.append(req)

    return {"success": True, "jobs": jobs}



# =========================================================
# MY JOBS
# =========================================================
@provider_bp.route("/jobs/my", methods=["GET"])
@login_required
def my_jobs():
    if current_user.role != "provider":
        return {"success": False}, 403

    jobs = service_requests_collection.find({
        "assigned_provider_id": current_user.id,
        "status": {"$in": ["accepted", "in_progress", "completed"]}
    })

    result = []
    for job in jobs:
        job["_id"] = str(job["_id"])
        result.append(job)

    return {"success": True, "jobs": result}


# =========================================================
# ACCEPT OFFER
# =========================================================
@provider_bp.route("/offers/<request_id>/accept", methods=["POST"])
@login_required
def accept_offer(request_id):
    offer = service_offers_collection.find_one({
        "request_id": request_id,
        "provider_id": current_user.id,
        "status": "offered"
    })

    if not offer:
        return {"success": False}, 400

    # Mark offer accepted
    service_offers_collection.update_one(
        {"_id": offer["_id"]},
        {"$set": {"status": "accepted"}}
    )

    # Update request
    service_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {
            "status": "accepted",
            "assigned_provider_id": current_user.id,
            "provider_name": current_user.name,
            "provider_phone": current_user.phone,
            "provider_email": current_user.email,
            "offer_expires_at": None,
            "updated_at": now_iso()
        }}
    )

    # Expire other offers
    service_offers_collection.update_many(
        {
            "request_id": request_id,
            "provider_id": {"$ne": current_user.id},
            "status": "offered"
        },
        {"$set": {"status": "expired"}}
    )

    return {"success": True}


# =========================================================
# REJECT OFFER
# =========================================================
@provider_bp.route("/offers/<request_id>/reject", methods=["POST"])
@login_required
def reject_offer(request_id):

    offer = service_offers_collection.find_one({
        "request_id": request_id,
        "provider_id": current_user.id,
        "status": "offered"
    })

    if not offer:
        return {"success": False}, 400

    # Mark rejected
    service_offers_collection.update_one(
        {"_id": offer["_id"]},
        {"$set": {"status": "rejected"}}
    )

    # Check if other active offers exist
    active = service_offers_collection.find_one({
        "request_id": request_id,
        "status": "offered"
    })

    if active:
        return {"success": True}

    req = service_requests_collection.find_one({
        "_id": ObjectId(request_id)
    })

    if not req:
        return {"success": False}, 404

    # Get previously contacted providers
    contacted = [
        o["provider_id"]
        for o in service_offers_collection.find({"request_id": request_id})
    ]

    ranked = get_ranked_providers(
        req["service_type"],
        req["address"]
    )

    fresh = [pid for pid, _ in ranked if pid not in contacted]

    if not fresh:
        service_requests_collection.update_one(
            {"_id": ObjectId(request_id)},
            {"$set": {"status": "expired", "updated_at": now_iso()}}
        )
        return {"success": True}

    # Offer next batch
    for pid in fresh[:3]:
        service_offers_collection.insert_one({
            "request_id": request_id,
            "provider_id": pid,
            "status": "offered",
            "created_at": now_iso()
        })

    service_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {
            "status": "offered",
            "offer_round": req["offer_round"] + 1,
            "updated_at": now_iso()
        }}
    )

    return {"success": True}


# =========================================================
# START JOB
# =========================================================
@provider_bp.route("/jobs/<request_id>/start", methods=["POST"])
@login_required
def start_job(request_id):

    result = service_requests_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "assigned_provider_id": current_user.id,
            "status": "accepted"
        },
        {"$set": {
            "status": "in_progress",
            "updated_at": now_iso()
        }}
    )

    if result.modified_count == 0:
        return {"success": False}, 400

    return {"success": True}


# =========================================================
# COMPLETE JOB
# =========================================================
@provider_bp.route("/jobs/<request_id>/complete", methods=["POST"])
@login_required
def complete_job(request_id):

    result = service_requests_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "assigned_provider_id": current_user.id,
            "status": "in_progress"
        },
        {"$set": {
            "status": "completed",
            "updated_at": now_iso()
        }}
    )

    if result.modified_count == 0:
        return {"success": False}, 400

    return {"success": True}
