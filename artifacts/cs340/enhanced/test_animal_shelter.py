import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

from ProjectOne_CRUD_Python_Module import AnimalShelter


class AnimalShelterValidationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.shelter = AnimalShelter.__new__(AnimalShelter)
        self.shelter.collection = MagicMock()

    def test_validate_query_accepts_dashboard_rescue_filter(self) -> None:
        query = AnimalShelter.build_rescue_query("water")

        is_valid, message = AnimalShelter.validate_query(query)

        self.assertTrue(is_valid)
        self.assertEqual(message, "Validation passed.")

    def test_validate_query_rejects_unknown_field(self) -> None:
        is_valid, message = AnimalShelter.validate_query({"foo": "bar"})

        self.assertFalse(is_valid)
        self.assertEqual(message, "Query field 'foo' is not allowed.")

    def test_update_rejects_disallowed_operator(self) -> None:
        modified_count = self.shelter.update(
            {"breed": "Labrador Retriever Mix"},
            {"$inc": {"age_upon_outcome_in_weeks": 1}},
        )

        self.assertEqual(modified_count, 0)
        self.shelter.collection.update_one.assert_not_called()

    def test_update_rejects_disallowed_field(self) -> None:
        modified_count = self.shelter.update(
            {"breed": "Labrador Retriever Mix"},
            {"$set": {"notes": "outside dashboard scope"}},
        )

        self.assertEqual(modified_count, 0)
        self.shelter.collection.update_one.assert_not_called()

    def test_update_allows_expected_set_operation(self) -> None:
        self.shelter.collection.update_one.return_value = SimpleNamespace(modified_count=1)

        modified_count = self.shelter.update(
            {"breed": "Labrador Retriever Mix"},
            {"$set": {"outcome_type": "Adoption"}},
        )

        self.assertEqual(modified_count, 1)
        self.shelter.collection.update_one.assert_called_once_with(
            {"breed": "Labrador Retriever Mix"},
            {"$set": {"outcome_type": "Adoption"}},
        )


if __name__ == "__main__":
    unittest.main()