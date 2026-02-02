"""
Shared MongoDB client for optimal performance.
Creates a single connection pool that's reused across all requests.
"""
import pymongo
from django.conf import settings
import os

# Global MongoDB client (singleton pattern for connection pooling)
_mongo_client = None
_db = None


def get_mongo_client():
    """Get or create MongoDB client with connection pooling."""
    global _mongo_client
    if _mongo_client is None:
        # Get MongoDB URI from settings or environment variable
        mongo_uri = getattr(settings, 'MONGODB_URI', None) or os.environ.get('MONGODB_URI', 'mongodb://localhost:27017')
        _mongo_client = pymongo.MongoClient(
            mongo_uri,
            maxPoolSize=50,  # Connection pool size
            minPoolSize=10,
            maxIdleTimeMS=45000,
            connectTimeoutMS=5000,
            serverSelectionTimeoutMS=5000
        )
    return _mongo_client


def get_db():
    """Get MongoDB database instance."""
    global _db
    if _db is None:
        client = get_mongo_client()
        db_name = getattr(settings, 'MONGODB_DB_NAME', 'hrms_lite_db')
        _db = client[db_name]
    return _db


def get_collection(collection_name):
    """Get a MongoDB collection by name."""
    db = get_db()
    return db[collection_name]