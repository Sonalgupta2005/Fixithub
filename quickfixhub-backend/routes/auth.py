from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from extensions import bcrypt
from models.user_model import User
from db.mongodb import (
    users_collection,
    provider_profiles_collection
)
from datetime import datetime
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)


# =====================================================
# SIGNUP
# =====================================================
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    role = data.get("role")

    if not all([name, email, password, phone, role]):
        return {"success": False, "message": "Missing required fields"}, 400

    if role not in ["homeowner", "provider"]:
        return {"success": False, "message": "Invalid role"}, 400

    created_at = datetime.utcnow().isoformat()

    try:
        result = users_collection.insert_one({
            "name": name,
            "email": email,
            "password_hash": bcrypt.generate_password_hash(password).decode(),
            "role": role,
            "phone": phone,
            "created_at": created_at,
        })
    except Exception:
        return {"success": False, "message": "User already exists"}, 400

    user_id = str(result.inserted_id)

    provider_profile_doc = None

    if role == "provider":
        service_types = data.get("serviceTypes")
        address = data.get("address")

        if not service_types or not isinstance(service_types, list) or not address:
            users_collection.delete_one({"_id": ObjectId(user_id)})
            return {
                "success": False,
                "message": "Providers must specify serviceTypes and address"
            }, 400

        provider_profile_doc = {
            "provider_id": user_id,
            "service_types": service_types,
            "address": address,
            "is_verified": False,
            "created_at": created_at
        }

        provider_profiles_collection.insert_one(provider_profile_doc)

    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    user = User(user_doc)

    login_user(user)
    session["role"] = role

    response = {
        "success": True,
        "user": user.to_dict()
    }

    if provider_profile_doc:
        provider_profile_doc["_id"] = str(provider_profile_doc.get("_id", ""))
        response["providerProfile"] = provider_profile_doc

    return jsonify(response), 201


# =====================================================
# LOGIN
# =====================================================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"success": False, "message": "Missing credentials"}, 400

    user_doc = users_collection.find_one({"email": email})

    if not user_doc:
        return {"success": False, "message": "Invalid credentials"}, 401

    if not bcrypt.check_password_hash(
        user_doc["password_hash"], password
    ):
        return {"success": False, "message": "Invalid credentials"}, 401

    user = User(user_doc)

    login_user(user)
    session["role"] = user.role

    response = {
        "success": True,
        "user": user.to_dict()
    }

    if user.role == "provider":
        profile = provider_profiles_collection.find_one(
            {"provider_id": user.id}
        )
        if profile:
            profile["_id"] = str(profile["_id"])
            response["providerProfile"] = profile

    return jsonify(response), 200


# =====================================================
# SESSION RESTORE
# =====================================================
@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    response = {
        "success": True,
        "user": current_user.to_dict()
    }

    if current_user.role == "provider":
        profile = provider_profiles_collection.find_one(
            {"provider_id": current_user.id}
        )
        if profile:
            profile["_id"] = str(profile["_id"])
            response["providerProfile"] = profile

    return jsonify(response)


# =====================================================
# LOGOUT
# =====================================================
@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    session.clear()
    return jsonify({"success": True})
