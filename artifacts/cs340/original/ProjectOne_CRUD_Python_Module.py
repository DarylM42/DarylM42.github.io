# ProjectOne_CRUD_Python_Module.py
from typing import Any, Dict, List, Optional
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError


class AnimalShelter:
    """
    CRUD operations for the AAC 'animals' collection.
    """

    def __init__(
        self,
        username: str,
        password: str,
        host: str = "localhost",
        port: int = 27017,
        db_name: str = "aac",
        collection_name: str = "animals",
    ) -> None:
        # Connection string with authentication
        uri = f"mongodb://{username}:{password}@{host}:{port}/{db_name}?authSource=admin"
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection: Collection = self.db[collection_name]

    def create(self, data: Dict[str, Any]) -> bool:
        if not isinstance(data, dict) or not data:
            return False
        try:
            result = self.collection.insert_one(data)
            return result.acknowledged and result.inserted_id is not None
        except Exception as e:
            print("Create error:", e)
            return False

    def read(self, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        query = query or {}
        try:
            cursor = self.collection.find(query)
            return list(cursor)
        except PyMongoError as e:
            print("Read error:", e)
            return []

    def update(self, query: Dict[str, Any], update_ops: Dict[str, Any], many: bool = False) -> int:
        if not query or not update_ops:
            return 0
        try:
            if many:
                result = self.collection.update_many(query, update_ops)
            else:
                result = self.collection.update_one(query, update_ops)
            return result.modified_count
        except PyMongoError as e:
            print("Update error:", e)
            return 0

    def delete(self, query: Dict[str, Any], many: bool = False) -> int:
        if not query:
            return 0
        try:
            if many:
                result = self.collection.delete_many(query)
            else:
                result = self.collection.delete_one(query)
            return result.deleted_count
        except PyMongoError as e:
            print("Delete error:", e)
            return 0
