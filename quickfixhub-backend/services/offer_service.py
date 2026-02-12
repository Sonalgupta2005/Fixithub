from datetime import datetime, timedelta, timezone
from bson import ObjectId
from utils.time_utils import now_iso
from db.mongodb import (
    service_offers_collection,
    service_requests_collection
)

OFFER_TIMEOUT_MINUTES = 15
MAX_OFFER_ROUNDS = 3


# =====================================================
# CREATE OFFER (SAFE — no duplicates)
# =====================================================
def create_offer(request_id, provider_id):

    # Prevent duplicate offers for same provider & request
    existing = service_offers_collection.find_one({
        "request_id": request_id,
        "provider_id": provider_id
    })

    if existing:
        return None  # already contacted

    offer_doc = {
        "request_id": request_id,
        "provider_id": provider_id,
        "status": "offered",
        "created_at": now_iso()
    }

    service_offers_collection.insert_one(offer_doc)
    return offer_doc


# =====================================================
# GET ACTIVE OFFER
# =====================================================
def get_active_offer(request_id, provider_id):

    return service_offers_collection.find_one({
        "request_id": request_id,
        "provider_id": provider_id,
        "status": "offered"
    })


# =====================================================
# EXPIRE OTHER OFFERS
# =====================================================
def expire_other_offers(request_id, accepted_provider_id):

    service_offers_collection.update_many(
        {
            "request_id": request_id,
            "provider_id": {"$ne": accepted_provider_id},
            "status": "offered"
        },
        {"$set": {"status": "expired"}}
    )


# =====================================================
# OFFER REQUEST TO PROVIDERS (SAFE + ROUND AWARE)
# =====================================================
def offer_request_to_providers(service_request_doc, provider_ids):

    request_id = str(service_request_doc["_id"])

    # Get all previously contacted providers
    previous_offers = service_offers_collection.find({
        "request_id": request_id
    })

    previously_contacted = {
        offer["provider_id"]
        for offer in previous_offers
    }

    # Filter out already-contacted providers
    fresh_providers = [
        pid for pid in provider_ids
        if pid not in previously_contacted
    ]

    if not fresh_providers:
        return  # Nothing to offer

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=OFFER_TIMEOUT_MINUTES)
    ).isoformat()

    # Create offers only for fresh providers
    for provider_id in fresh_providers:
        create_offer(request_id, provider_id)

    # Update request round atomically
    service_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": "offered",
                "offer_expires_at": expires_at,
                "updated_at": now_iso()
            },
            "$inc": {
                "offer_round": 1
            }
        }
    )
