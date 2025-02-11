import os
from flask import Flask, jsonify, request
from pymongo import MongoClient
import mysql.connector

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

# MySQL Configuration
mysql_conn = mysql.connector.connect(
    host = "mysql",
    user = os.getenv("MYSQL_USER"), 
    password = os.getenv("MYSQL_PASSWORD"),
    database = os.getenv("MYSQL_DATABASE"),
    port = os.getenv("MYSQL_PORT")
)

def fetch_grades():
    try:
        cursor = mysql_conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM grades")  # Adjust columns if needed
        grades = cursor.fetchall()
        cursor.close()
        mysql_conn.close()
        return grades
    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
        return []


def add_to_mongo(grades):
    try:
        mongo_uri = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}?authSource=admin"
        client = MongoClient(mongo_uri)
        db = client[MONGO_DATABASE]
        collection = db["statistics"]
        
        if grades:
            collection.insert_many(grades)
            print("Data written to MongoDB successfully.")
        else:
            print("No new data to insert.")
    except Exception as e:
        print(f"MongoDB Error: {e}")

if __name__ == "__main__":
    grades_data = fetch_grades()
    add_to_mongo(grades_data)