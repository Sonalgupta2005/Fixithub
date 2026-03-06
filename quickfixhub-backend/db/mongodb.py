import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI is not set")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

db = client["quickfixhub"]

users_collection = db["users"]
provider_profiles_collection = db["provider_profiles"]
service_requests_collection = db["service_requests"]
service_offers_collection = db["service_offers"]
