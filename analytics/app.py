from pymongo import MongoClient
import mysql.connector
from apscheduler.schedulers.background import BackgroundScheduler
import time
import json
import db
from db import connect_to_mysql

TIMESTAMP_FILE="timestamp.json"

def get_json():
    try:
        with open(TIMESTAMP_FILE, 'r') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        return 0  # Return 0 if file doesn't exist, meaning first fetch

def update_json(timestamp, max_grade, min_grade):
    data = {
        "last_fetched_timestamp": timestamp,
        "max_grade": max_grade,
        "min_grade": min_grade
    }
    with open(TIMESTAMP_FILE, 'w') as file:
        json.dump(data, file)

def fetch_data():
    try:
        mysql_conn = connect_to_mysql() # Reconnect to mysql
        print('connected')
        cursor = mysql_conn.cursor(dictionary=True)
        if cursor:
            print('cursor found')

        # get json file
        json_data = get_json()
        if json_data == 0:
            json_data = {
                "last_fetched_timestamp": 0,
                "max_grade": 0,
                "min_grade": 0
            }
        
        # Get the last fetched timestamp
        start_timestamp = json_data['last_fetched_timestamp']
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
            # Compute min and max grades. These are the grades grabbed from MYSQL
            max_grade = max(grade['grade'] for grade in grades)
            min_grade = min(grade['grade'] for grade in grades)

            # Compare the max and min to the ones inside the json file
            max_grade = max_grade if json_data['max_grade'] == 0 else max(max_grade, json_data['max_grade'])
            min_grade = min_grade if json_data['min_grade'] == 0 else min(min_grade, json_data['min_grade'])

            # Store data in MongoDB
            add_to_mongo(grades, max_grade, min_grade)

            # Update timestamp in json file
            update_json(end_timestamp, max_grade, min_grade)

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
    except Exception as e:
        print(f"Error: {e}")


def add_to_mongo(grades, max_grade, min_grade):
    try:
        mongo_uri = f"mongodb://{db.MONGO_USER}:{db.MONGO_PASSWORD}@{db.MONGO_HOST}:{db.MONGO_PORT}/{db.MONGO_DATABASE}?authSource=admin"
        client = MongoClient(mongo_uri)
        mongo_db = client[db.MONGO_DATABASE]
        grades_collection = mongo_db["grades"]
        print("Connected to mongo")
        
        if grades:
            grades_collection.insert_many(grades)
        else:
            print("No new data to insert.")

        # Store max/min in a separate collection
        stats_collection = mongo_db["statistics"]
        stats_collection.insert_one({
            "timestamp": int(time.time()),
            "max_grade": max_grade,
            "min_grade": min_grade
        })

        print("Data written to MongoDB successfully.")
        
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

