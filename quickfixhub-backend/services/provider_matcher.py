from bson import ObjectId
from db.mongodb import (
    provider_profiles_collection,
    service_requests_collection
)

MAX_ACTIVE_JOBS = 3


# =====================================================
# COUNT ACTIVE JOBS (MongoDB)
# =====================================================
def count_active_jobs(provider_id):

    count = service_requests_collection.count_documents({
        "assigned_provider_id": provider_id,
        "status": {"$in": ["accepted", "in_progress"]}
    })

    return count


# =====================================================
# GET ELIGIBLE PROVIDERS
# =====================================================
def get_eligible_providers(service_type, address):

    eligible = []

    # Fetch all providers (you can optimize later)
    providers = provider_profiles_collection.find({})

    for profile in providers:

        provider_id = profile["provider_id"]

        # Optional future verification check
        # if not profile.get("is_verified", False):
        #     continue

        # Service type match
        if service_type not in profile.get("service_types", []):
            continue

        # Active job limit check
        if count_active_jobs(provider_id) >= MAX_ACTIVE_JOBS:
            continue

        eligible.append(provider_id)

    return eligible


# =====================================================
# RANK PROVIDERS
# =====================================================
def rank_providers(provider_ids):

    ranked = []

    for pid in provider_ids:
        active_jobs = count_active_jobs(pid)

        # Simple load-based scoring
        score = (MAX_ACTIVE_JOBS - active_jobs) * 10

        ranked.append((pid, score))

    return sorted(ranked, key=lambda x: x[1], reverse=True)


# =====================================================
# ENTRY POINT
# =====================================================
def get_ranked_providers(service_type, address):

    eligible = get_eligible_providers(service_type, address)

    return rank_providers(eligible)
