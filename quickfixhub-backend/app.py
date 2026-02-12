from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import bcrypt, login_manager
from routes.auth import auth_bp
from routes.service_request import service_bp
from routes.provider import provider_bp
from models.user_model import User
from db.mongodb import users_collection
from bson import ObjectId

app = Flask(__name__)
app.config.from_object(Config)

# -----------------------------------------
# CORS (Update origin for production later)
# -----------------------------------------
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:8080"]  # Vite dev server
)

# -----------------------------------------
# Extensions
# -----------------------------------------
bcrypt.init_app(app)
login_manager.init_app(app)


# -----------------------------------------
# Flask-Login User Loader (MongoDB)
# -----------------------------------------
@login_manager.user_loader
def load_user(user_id):
    try:
        user_doc = users_collection.find_one(
            {"_id": ObjectId(user_id)}
        )
        if user_doc:
            return User(user_doc)
        return None
    except:
        return None


# -----------------------------------------
# Blueprints
# -----------------------------------------
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(service_bp, url_prefix="/api/service")
app.register_blueprint(provider_bp, url_prefix="/api/provider")


# -----------------------------------------
# Health Check
# -----------------------------------------
@app.route("/")
def health():
    return {"status": "running", "database": "MongoDB"}


# -----------------------------------------
# Run
# -----------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
