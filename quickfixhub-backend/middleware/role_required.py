from flask import session, jsonify
from functools import wraps
from flask_login import login_required

def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        @login_required
        def decorated(*args, **kwargs):
            if session.get("role") != role:
                return jsonify({"error": "Unauthorized"}), 403
            return fn(*args, **kwargs)
        return decorated
    return wrapper
