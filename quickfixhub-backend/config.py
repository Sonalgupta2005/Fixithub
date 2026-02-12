import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY =os.getenv("SECRET_KEY")  # Replace with a secure key in production
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False  # True in production (HTTPS)
