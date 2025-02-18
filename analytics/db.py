import os
import mysql.connector
from pymongo import MongoClient

# MongoDB Configuration
MONGO_HOST = os.getenv("MONGO_HOSTNAME")
MONGO_PORT = int(os.getenv("MONGO_PORT"))
MONGO_USER = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
MONGO_DATABASE = os.getenv("MONGO_INITDB_DATABASE")

# MySQL Connection
def connect_to_mysql():
    mysql_conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOSTNAME"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=int(os.getenv("MYSQL_PORT"))
    )
    return mysql_conn
