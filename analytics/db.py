import os
import mysql.connector
from pymongo import MongoClient

# MongoDB Configuration
MONGO_HOST = "mongo"
MONGO_PORT = int(os.getenv("MONGO_PORT"))
MONGO_USER = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
MONGO_DATABASE = os.getenv("MONGO_INITDB_DATABASE")
MONGO_GRADE_COLLECTION = os.getenv("MONGO_GRADE_COLLECTION")
MONGO_MIN_MAX_COLLECTION = os.getenv("MONGO_MIN_MAX_COLLECTION")

# MySQL Connection
def connect_to_mysql():
    mysql_conn = None
    if mysql_conn is None or not mysql_conn.is_connected():
        mysql_conn = mysql.connector.connect(
            host="mysql",
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
            port=int(os.getenv("MYSQL_PORT"))
        )
    return mysql_conn
