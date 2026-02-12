from datetime import datetime
from db.mongodb import (
    service_requests_collection,
    service_offers_collection
)
from utils.time_utils import now_iso
from services.offer_service import (
    offer_request_to_providers,
    MAX_OFFER_ROUNDS
)
from services.provider_matcher import get_ranked_providers


def handle_expired_offers():

    # Fetch all currently offered requests
    offered_requests = service_requests_collection.find({
        "status": "offered"
    })

    now = now_iso()

    for request in offered_requests:

        # Skip if no expiry or not yet expired
        if not request.get("offer_expires_at") \
           or request["offer_expires_at"] >= now:
            continue

        request_id = request["_id"]

        # ------------------------------------
        # Expire all active offers
        # ------------------------------------
        service_offers_collection.update_many(
            {
                "request_id": request_id,
                "status": "offered"
            },
            {
                "$set": {"status": "expired"}
            }
        )

        # ------------------------------------
        # Stop if max rounds reached
        # ------------------------------------
        if request.get("offer_round", 0) >= MAX_OFFER_ROUNDS:

            service_requests_collection.update_one(
                {"_id": request_id},
                {
                    "$set": {
                        "status": "expired",
                        "updated_at": now
                    }
                }
            )
            continue

        # ------------------------------------
        # Collect previously contacted providers
        # ------------------------------------
        previous_offers = service_offers_collection.find({
            "request_id": request_id
        })

        previously_contacted = {
            offer["provider_id"]
            for offer in previous_offers
        }

        # ------------------------------------
        # Find ranked providers
        # ------------------------------------
        ranked = get_ranked_providers(
            request["service_type"],
            request["address"]
        )

        fresh_providers = [
            pid for pid, _ in ranked
            if pid not in previously_contacted
        ]

        # ------------------------------------
        # No providers left → EXPIRE
        # ------------------------------------
        if not fresh_providers:

            service_requests_collection.update_one(
                {"_id": request_id},
                {
                    "$set": {
                        "status": "expired",
                        "updated_at": now
                    }
                }
            )
            continue

        # ------------------------------------
        # Re-offer to next batch
        # ------------------------------------
        offer_request_to_providers(
            request,
            fresh_providers[:3]
        )
