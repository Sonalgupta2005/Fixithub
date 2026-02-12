class ServiceOffer:
    def __init__(self, data):
        self.id = str(data["_id"])
        self.request_id = data["request_id"]
        self.provider_id = data["provider_id"]
        self.status = data["status"]
        self.created_at = data["created_at"]

    def to_dict(self):
        return {
            "id": self.id,
            "requestId": self.request_id,
            "providerId": self.provider_id,
            "status": self.status,
            "createdAt": self.created_at
        }
