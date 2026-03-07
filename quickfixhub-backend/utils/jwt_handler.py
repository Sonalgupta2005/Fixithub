import jwt
import datetime
import os

SECRET = os.getenv("JWT_SECRET")

if not SECRET:
    raise RuntimeError("JWT_SECRET environment variable is not set")


# =====================================================
# CREATE TOKEN
# =====================================================
def create_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }

    token = jwt.encode(payload, SECRET, algorithm="HS256")

    return token


# =====================================================
# VERIFY TOKEN
# =====================================================
def verify_token(token):

    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])

        return payload.get("user_id")

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None