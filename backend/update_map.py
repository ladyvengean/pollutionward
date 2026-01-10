import subprocess
import time

while True:
    print("[INFO] Updating AQI map...")

    subprocess.run(["python", "fetch_waqi.py"])
    subprocess.run(["python", "map_stations_to_wards.py"])
    subprocess.run(["python", "aggregate.py"])
    subprocess.run(["python", "heatmap2.py"])

    print("[INFO] Map updated successfully")
    time.sleep(600)  # every 10 minutes
