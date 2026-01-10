import time
import subprocess

while True:
    print("[INFO] Updating AQI data...")
    subprocess.run(["python", "fetch_waqi.py"])
    subprocess.run(["python", "map_stations_to_wards.py"])
    subprocess.run(["python", "aggregate.py"])
    time.sleep(600)  # every 10 minutes
