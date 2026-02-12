class ServiceRequest:
    def __init__(self, data):
        self.id = str(data["_id"])
        self.user_id = data["user_id"]
        self.user_name = data["user_name"]
        self.user_email = data["user_email"]
        self.user_phone = data["user_phone"]
        self.service_type = data["service_type"]
        self.description = data["description"]
        self.address = data["address"]
        self.preferred_date = data["preferred_date"]
        self.preferred_time = data.get("preferred_time")
        self.status = data["status"]
        self.assigned_provider_id = data.get("assigned_provider_id")
        self.provider_name = data.get("provider_name")
        self.provider_phone = data.get("provider_phone")
        self.provider_email = data.get("provider_email")
        self.offer_round = data.get("offer_round", 0)
        self.offer_expires_at = data.get("offer_expires_at")
        self.created_at = data["created_at"]
        self.updated_at = data["updated_at"]

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "userName": self.user_name,
            "userEmail": self.user_email,
            "userPhone": self.user_phone,
            "serviceType": self.service_type,
            "description": self.description,
            "address": self.address,
            "preferredDate": self.preferred_date,
            "preferredTime": self.preferred_time,
            "status": self.status,
            "assignedProviderId": self.assigned_provider_id,
            "providerName": self.provider_name,
            "providerPhone": self.provider_phone,
            "providerEmail": self.provider_email,
            "offerRound": self.offer_round,
            "offerExpiresAt": self.offer_expires_at,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }
