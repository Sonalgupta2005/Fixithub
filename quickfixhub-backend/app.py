from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import bcrypt
from routes.auth import auth_bp
from routes.service_request import service_bp
from routes.provider import provider_bp
import os

app = Flask(__name__)
app.config.from_object(Config)

# -----------------------------------------
# CORS
# -----------------------------------------
CORS(
    app,
    origins=[
        "http://localhost:8080",
        "https://fixithub-liard.vercel.app"
    ]
)

# -----------------------------------------
# Extensions
# -----------------------------------------
bcrypt.init_app(app)

# -----------------------------------------
# Test Route
# -----------------------------------------
@app.route("/test")
def test():
    return "server working"


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
    return {
        "status": "running",
        "database": "MongoDB"
    }


# -----------------------------------------
# Run
# -----------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)