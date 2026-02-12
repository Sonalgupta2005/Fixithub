import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["quickfixhub"]

users_collection = db["users"]
provider_profiles_collection = db["provider_profiles"]
service_requests_collection = db["service_requests"]
service_offers_collection = db["service_offers"]
