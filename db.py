"""
db.py - MySQL Database Connection and Helper Module
Campus Digital Twin
"""

import pymysql
import pymysql.cursors
from config import Config

# Database credentials sourced from centralized Config
DB_HOST = Config.DB_HOST
DB_PORT = Config.DB_PORT
DB_USER = Config.DB_USER
DB_PASSWORD = Config.DB_PASSWORD
DB_NAME = Config.DB_NAME


def get_db_connection():
    """Establish and return a connection to MySQL with DictCursor."""
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False
    )


def execute_query(query, params=None):
    """Execute a read query and return all results as a list of dicts."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchall()
    finally:
        connection.close()


def execute_one(query, params=None):
    """Execute a read query and return a single row as a dict."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchone()
    finally:
        connection.close()


def execute_commit(query, params=None):
    """Execute an INSERT, UPDATE, or DELETE query and commit."""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params or ())
            affected_rows = cursor.rowcount
            last_id = cursor.lastrowid
            connection.commit()
            return {"affected_rows": affected_rows, "last_id": last_id}
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        connection.close()


def check_db_connection():
    """Test connection to MySQL and return status dict."""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT DATABASE() AS current_db, VERSION() AS db_version")
            result = cursor.fetchone()
        connection.close()
        return {
            "status": "connected",
            "database": result["current_db"] if result else DB_NAME,
            "version": result["db_version"] if result else "unknown",
            "host": f"{DB_HOST}:{DB_PORT}",
            "user": DB_USER
        }
    except Exception as err:
        return {
            "status": "error",
            "message": str(err),
            "host": f"{DB_HOST}:{DB_PORT}",
            "database": DB_NAME
        }
