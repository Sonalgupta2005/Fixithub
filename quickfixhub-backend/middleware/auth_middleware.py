from functools import wraps
from flask import request, jsonify
from utils.jwt_handler import verify_token
from db.mongodb import users_collection
from bson import ObjectId


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"success": False, "message": "Token missing"}), 401

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return jsonify({"success": False, "message": "Invalid auth header"}), 401

        user_id = verify_token(token)

        if not user_id:
            return jsonify({"success": False, "message": "Invalid token"}), 401

        user_doc = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if not user_doc:
            return jsonify({"success": False, "message": "User not found"}), 401

        # attach user to request
        request.user = user_doc

        return f(*args, **kwargs)

    return decorated