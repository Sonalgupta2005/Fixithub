class User:
    def __init__(self, doc):
        self.id = str(doc["_id"])
        self.name = doc["name"]
        self.email = doc["email"]
        self.role = doc["role"]
        self.phone = doc.get("phone")
        self.created_at = doc.get("created_at")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "created_at": self.created_at
        }