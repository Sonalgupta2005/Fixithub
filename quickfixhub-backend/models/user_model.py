from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, doc):
        self.id = str(doc["_id"])      # REQUIRED for Flask-Login
        self.name = doc["name"]
        self.email = doc["email"]
        self.role = doc["role"]
        self.phone = doc["phone"]
        self.created_at = doc["created_at"]

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "created_at": self.created_at
        }
