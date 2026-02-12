class ProviderProfile:
    def __init__(self, data):
        self.provider_id = str(data["provider_id"])
        self.service_types = data["service_types"]
        self.address = data["address"]
        self.is_verified = data.get("is_verified", False)
        self.created_at = data["created_at"]

    def to_dict(self):
        return {
            "provider_id": self.provider_id,
            "service_types": self.service_types,
            "address": self.address,
            "is_verified": self.is_verified,
            "created_at": self.created_at
        }
