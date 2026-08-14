# ProjectOne_CRUD_Python_Module.py
import os
from typing import Any, Dict, List, Optional, Sequence, Tuple
from urllib.parse import quote_plus
from pymongo import MongoClient
from pymongo import ASCENDING
from pymongo.collection import Collection
from pymongo.errors import PyMongoError


class AnimalShelter:
    """
    CRUD operations for the AAC 'animals' collection.
    """

    REQUIRED_FIELDS = {
        "animal_type": str,
        "breed": str,
        "color": str,
        "date_of_birth": str,
        "outcome_type": str,
        "sex_upon_outcome": str,
        "age_upon_outcome_in_weeks": (int, float),
        "location_lat": (int, float),
        "location_long": (int, float),
    }
    ALLOWED_QUERY_FIELDS = set(REQUIRED_FIELDS) | {"name"}
    ALLOWED_UPDATE_OPERATORS = {"$set"}

    RESCUE_BREEDS = {
        "water": [
            "Labrador Retriever Mix",
            "Chesapeake Bay Retriever",
            "Newfoundland",
        ],
        "mountain": ["German Shepherd", "Border Collie", "Bloodhound"],
        "disaster": ["Doberman Pinscher", "Rottweiler", "Belgian Malinois"],
    }
    ALLOWED_LOGICAL_OPERATORS = {"$and", "$or"}
    ALLOWED_FIELD_OPERATORS = {"$eq", "$gt", "$gte", "$in", "$lt", "$lte", "$ne", "$nin", "$options", "$regex"}

    def __init__(
        self,
        username: Optional[str] = None,
        password: Optional[str] = None,
        host: str = "localhost",
        port: int = 27017,
        db_name: str = "aac",
        collection_name: str = "animals",
    ) -> None:
        username = username or os.getenv("AAC_MONGO_USERNAME")
        password = password or os.getenv("AAC_MONGO_PASSWORD")
        host = os.getenv("AAC_MONGO_HOST", host)
        port = int(os.getenv("AAC_MONGO_PORT", port))
        db_name = os.getenv("AAC_MONGO_DB", db_name)
        collection_name = os.getenv("AAC_MONGO_COLLECTION", collection_name)

        if not username or not password:
            raise ValueError(
                "MongoDB credentials are required. Set AAC_MONGO_USERNAME and "
                "AAC_MONGO_PASSWORD environment variables or pass credentials explicitly."
            )

        safe_username = quote_plus(username)
        safe_password = quote_plus(password)

        # Connection string with authentication sourced from configuration.
        uri = f"mongodb://{safe_username}:{safe_password}@{host}:{port}/{db_name}?authSource=admin"
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection: Collection = self.db[collection_name]
        self.ensure_indexes()

    @classmethod
    def validate_document(cls, data: Dict[str, Any]) -> Tuple[bool, str]:
        """Validate required fields before documents are inserted or updated."""
        if not isinstance(data, dict) or not data:
            return False, "Document data must be a non-empty dictionary."

        for field_name, expected_type in cls.REQUIRED_FIELDS.items():
            if field_name not in data:
                return False, f"Missing required field: {field_name}."

            value = data[field_name]
            if value is None or (isinstance(value, str) and not value.strip()):
                return False, f"Field '{field_name}' cannot be empty."

            if not isinstance(value, expected_type):
                type_name = cls._type_name(expected_type)
                return False, f"Field '{field_name}' must be of type {type_name}."

        return True, "Validation passed."

    @staticmethod
    def _type_name(expected_type: Any) -> str:
        if isinstance(expected_type, tuple):
            return "/".join(type_item.__name__ for type_item in expected_type)
        return expected_type.__name__

    @staticmethod
    def _is_literal_value(value: Any) -> bool:
        return isinstance(value, (str, int, float, bool)) or value is None

    @classmethod
    def _is_safe_filter_value(cls, value: Any) -> bool:
        if isinstance(value, dict):
            return all(
                isinstance(operator, str)
                and operator in cls.ALLOWED_FIELD_OPERATORS
                and cls._is_safe_filter_value(nested)
                for operator, nested in value.items()
            )
        if isinstance(value, list):
            return all(cls._is_literal_value(item) for item in value)
        return cls._is_literal_value(value)

    @classmethod
    def validate_query(cls, query: Optional[Dict[str, Any]]) -> Tuple[bool, str]:
        if query is None:
            return True, "Validation passed."
        if not isinstance(query, dict):
            return False, "Query must be a dictionary."
        for field_name, value in query.items():
            if not isinstance(field_name, str) or not field_name:
                return False, "Query field names must be non-empty strings."
            if field_name.startswith("$"):
                if field_name not in cls.ALLOWED_LOGICAL_OPERATORS:
                    return False, f"Query operator '{field_name}' is not allowed."
                if not isinstance(value, list) or not value:
                    return False, f"Logical operator '{field_name}' requires a non-empty list."
                for query_fragment in value:
                    is_valid, message = cls.validate_query(query_fragment)
                    if not is_valid:
                        return False, message
                continue
            if field_name not in cls.ALLOWED_QUERY_FIELDS:
                return False, f"Query field '{field_name}' is not allowed."
            if not cls._is_safe_filter_value(value):
                return False, f"Query value for '{field_name}' is not supported."
        return True, "Validation passed."

    @classmethod
    def validate_update_ops(cls, update_ops: Dict[str, Any]) -> Tuple[bool, str]:
        if not isinstance(update_ops, dict) or not update_ops:
            return False, "Update operations are required."
        if not any(operator.startswith("$") for operator in update_ops):
            return False, "Update operations must use MongoDB update operators."

        for operator, payload in update_ops.items():
            if operator not in cls.ALLOWED_UPDATE_OPERATORS:
                return False, f"Update operator '{operator}' is not allowed."
            if operator == "$set":
                if not isinstance(payload, dict) or not payload:
                    return False, "$set payload must be a non-empty dictionary."
                for field_name, value in payload.items():
                    if field_name not in cls.REQUIRED_FIELDS:
                        return False, f"Update field '{field_name}' is not allowed."
                    expected_type = cls.REQUIRED_FIELDS[field_name]
                    if not isinstance(value, expected_type):
                        type_name = cls._type_name(expected_type)
                        return False, f"Update field '{field_name}' must be of type {type_name}."

        return True, "Validation passed."

    @staticmethod
    def _normalize_sort(sort: Optional[Sequence[Tuple[str, int]]]) -> Optional[List[Tuple[str, int]]]:
        if not sort:
            return None
        return [(field_name, direction) for field_name, direction in sort if field_name]

    def ensure_indexes(self) -> None:
        """Create indexes used by the dashboard filters."""
        try:
            self.collection.create_index([("breed", ASCENDING)], name="breed_idx")
            self.collection.create_index(
                [("age_upon_outcome_in_weeks", ASCENDING)],
                name="age_upon_outcome_in_weeks_idx",
            )
            self.collection.create_index(
                [("location_lat", ASCENDING), ("location_long", ASCENDING)],
                name="location_idx",
            )
        except PyMongoError as error:
            print("Index creation error:", error)

    def create(self, data: Dict[str, Any]) -> bool:
        is_valid, message = self.validate_document(data)
        if not is_valid:
            print("Create validation error:", message)
            return False
        try:
            result = self.collection.insert_one(data)
            return result.acknowledged and result.inserted_id is not None
        except PyMongoError as error:
            print("Create error:", error)
            return False

    def read(
        self,
        query: Optional[Dict[str, Any]] = None,
        projection: Optional[Dict[str, Any]] = None,
        limit: int = 0,
        sort: Optional[Sequence[Tuple[str, int]]] = None,
    ) -> List[Dict[str, Any]]:
        query = query or {}
        is_valid, message = self.validate_query(query)
        if not is_valid:
            print("Read validation error:", message)
            return []
        try:
            cursor = self.collection.find(query, projection)
            normalized_sort = self._normalize_sort(sort)
            if normalized_sort:
                cursor = cursor.sort(normalized_sort)
            if limit > 0:
                cursor = cursor.limit(limit)
            return list(cursor)
        except PyMongoError as error:
            print("Read error:", error)
            return []

    def update(self, query: Dict[str, Any], update_ops: Dict[str, Any], many: bool = False) -> int:
        is_valid, message = self.validate_query(query)
        if not is_valid:
            print("Update validation error:", message)
            return 0
        if not query or not update_ops:
            print("Update validation error: query and update operations are required.")
            return 0
        is_valid, message = self.validate_update_ops(update_ops)
        if not is_valid:
            print("Update validation error:", message)
            return 0
        try:
            if many:
                result = self.collection.update_many(query, update_ops)
            else:
                result = self.collection.update_one(query, update_ops)
            return result.modified_count
        except PyMongoError as error:
            print("Update error:", error)
            return 0

    def delete(self, query: Dict[str, Any], many: bool = False) -> int:
        is_valid, message = self.validate_query(query)
        if not is_valid:
            print("Delete validation error:", message)
            return 0
        if not query:
            print("Delete validation error: refusing to delete without a filter.")
            return 0
        try:
            if many:
                result = self.collection.delete_many(query)
            else:
                result = self.collection.delete_one(query)
            return result.deleted_count
        except PyMongoError as error:
            print("Delete error:", error)
            return 0

    @classmethod
    def build_rescue_query(cls, rescue_type: str, max_age_weeks: int = 104) -> Dict[str, Any]:
        breeds = cls.RESCUE_BREEDS.get(rescue_type.lower())
        if not breeds:
            raise ValueError(
                f"Unsupported rescue type '{rescue_type}'. Expected one of: {', '.join(sorted(cls.RESCUE_BREEDS))}."
            )
        return {
            "$and": [
                {"age_upon_outcome_in_weeks": {"$lte": max_age_weeks}},
                {"breed": {"$in": breeds}},
            ]
        }
