"""
Shared MongoDB client for optimal performance.
Creates a single connection pool that's reused across all requests.
"""
import pymongo
from django.conf import settings

# Global MongoDB client (singleton pattern for connection pooling)
_mongo_client = None
_db = None


def get_mongo_client():
    """Get or create MongoDB client with connection pooling."""
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = pymongo.MongoClient(
            settings.DATABASES['default']['CLIENT']['host'],
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
        _db = client[settings.DATABASES['default']['NAME']]
    return _db


def get_collection(collection_name):
    """Get a MongoDB collection by name."""
    db = get_db()
    return db[collection_name]
