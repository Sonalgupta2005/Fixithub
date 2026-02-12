from flask import Blueprint
from middleware.role_required import role_required

home_bp = Blueprint("home", __name__)

@home_bp.route("/dashboard")
@role_required("homeowner")
def homeowner_dashboard():
    return {"msg": "Homeowner dashboard"}
