# cron_runner.py
import time
from services.timeout_service import handle_expired_offers

while True:
    print("Checking for expired offers...")
    handle_expired_offers()
    time.sleep(180)  # every 60 seconds
