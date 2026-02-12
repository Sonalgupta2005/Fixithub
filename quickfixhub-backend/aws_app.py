# aws_app.py

from flask import Flask
from flask_cors import CORS
import os
import boto3

from config import Config
from extensions import bcrypt, login_manager
from routes.auth import auth_bp
from routes.service_request import service_bp
from routes.provider import provider_bp
from models.user import User

# ----------------------------------
# Flask App
# ----------------------------------
app = Flask(__name__)
app.config.from_object(Config)

# ----------------------------------
# CORS (Frontend domain)
# ----------------------------------
CORS(
    app,
    supports_credentials=True,
    origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
)

# ----------------------------------
# Extensions
# ----------------------------------
bcrypt.init_app(app)
login_manager.init_app(app)

# ----------------------------------
# AWS Configuration (IAM-based)
# ----------------------------------
AWS_REGION = "us-east-1"
SNS_TOPIC_ARN = os.getenv("SNS_TOPIC_ARN")

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
sns = boto3.client("sns", region_name=AWS_REGION)

# ----------------------------------
# DynamoDB Tables
# (MUST already exist in AWS)
# ----------------------------------
users_table = dynamodb.Table("Users")
providers_table = dynamodb.Table("Providers")
service_requests_table = dynamodb.Table("ServiceRequests")
service_offers_table = dynamodb.Table("ServiceOffers")

# ----------------------------------
# SNS helper
# ----------------------------------
def send_sns(subject: str, message: str):
    if not SNS_TOPIC_ARN:
        return
    try:
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=subject,
            Message=message
        )
    except Exception as e:
        print("SNS publish error:", e)

# ----------------------------------
# Flask-Login user loader (DynamoDB)
# ----------------------------------
@login_manager.user_loader
def load_user(user_id):
    res = users_table.get_item(Key={"user_id": user_id})
    item = res.get("Item")
    return User(**item) if item else None

# ----------------------------------
# Blueprints
# ----------------------------------
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(service_bp, url_prefix="/api/service")
app.register_blueprint(provider_bp, url_prefix="/api/provider")

# ----------------------------------
# Health check
# ----------------------------------
@app.route("/")
def health():
    return {
        "status": "running",
        "env": "aws",
        "region": AWS_REGION
    }

# ----------------------------------
# Entry point (DEMO MODE)
# ----------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
