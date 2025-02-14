import os
from flask import Flask, jsonify, request
from pymongo import MongoClient
import mysql.connector
from apscheduler.schedulers.background import BackgroundScheduler
import time
import json

app = Flask(__name__)

# MongoDB Configuration
MONGO_HOST = "mongo"
MONGO_PORT = int(os.getenv("MONGO_PORT"))
MONGO_USER = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD",)
MONGO_DATABASE = os.getenv("MONGO_INITDB_DATABASE")

mongo_client = MongoClient('mongodb://mongodb:27017/')
mongo_db = mongo_client[os.getenv("MONGO_INITDB_DATABASE")]
analytics_collection = mongo_db['grades']


mysql_conn = None
def connect_to_mysql():
    global mysql_conn
    # MySQL Configuration
    if mysql_conn is None or not mysql_conn.is_connected():
        mysql_conn = mysql.connector.connect(
            host = "mysql",
            user = os.getenv("MYSQL_USER"), 
            password = os.getenv("MYSQL_PASSWORD"),
            database = os.getenv("MYSQL_DATABASE"),
            port = os.getenv("MYSQL_PORT")
    )


TIMESTAMP_FILE="timestamp.json"

def get_last_fetched_timestamp():
    try:
        with open(TIMESTAMP_FILE, 'r') as file:
            data = json.load(file)
            # return data.get('last_fetched_timestamp', 0)
            return data['last_fetched_timestamp']
    except FileNotFoundError:
        return 0  # Return 0 if file doesn't exist, meaning first fetch

def update_last_fetched_timestamp(timestamp):
    with open(TIMESTAMP_FILE, 'w') as file:
        json.dump({"last_fetched_timestamp": timestamp}, file)

def fetch_data():
    try:
        connect_to_mysql() # Reconnect to mysql
        cursor = mysql_conn.cursor(dictionary=True)

        # Get the last fetched timestamp
        start_timestamp = get_last_fetched_timestamp()
        end_timestamp = int(time.time())  # Current timestamp (end_timestamp)

        # Fetch grades with the time range
        cursor.execute("""
            SELECT * FROM grades
            WHERE created_at > %s AND created_at <= %s
        """, (start_timestamp, end_timestamp))
        
        grades = cursor.fetchall()
        cursor.close()

        # Close the MySQL connection (or reuse it)
        mysql_conn.close()

        if grades:
            # Pass the data to MongoDB
            add_to_mongo(grades)

            # Update the last fetched timestamp to the current time
            update_last_fetched_timestamp(end_timestamp)

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
    except Exception as e:
        print(f"Error: {e}")


def add_to_mongo(grades):
    try:
        mongo_uri = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}?authSource=admin"
        client = MongoClient(mongo_uri)
        db = client[MONGO_DATABASE]
        collection = db["statistics"]
        print("connected")
        
        if grades:
            collection.insert_many(grades)
            print("Data written to MongoDB successfully.")
        else:
            print("No new data to insert.")
    except Exception as e:
        print(f"MongoDB Error: {e}")

def init_scheduler():
    sched = BackgroundScheduler(daemon=True)
    sched.add_job(fetch_data,
                  'interval',
                  seconds=5) # 5 second interval between each data fetch
                
    sched.start()

def keep_running():
    while True:
        time.sleep(60)  # Keeps the container running indefinitely

if __name__ == "__main__":
    init_scheduler()
    keep_running()

