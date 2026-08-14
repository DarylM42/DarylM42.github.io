from pathlib import Path
from typing import Dict, Optional

import pandas as pd
import plotly.express as px
from IPython.display import Image, display

from ProjectOne_CRUD_Python_Module import AnimalShelter


def display_logo(image_path: str) -> None:
    """Display the dashboard logo when the image file is available."""
    logo_path = Path(image_path)
    if logo_path.exists():
        display(Image(filename=str(logo_path)))
    else:
        print(f"Logo not found at {logo_path}. Skipping image display.")


def records_to_dataframe(
    shelter: AnimalShelter,
    query: Optional[Dict] = None,
    projection: Optional[Dict] = None,
    limit: int = 0,
) -> pd.DataFrame:
    """Run a filtered MongoDB query and return a clean DataFrame."""
    records = shelter.read(query=query, projection=projection, limit=limit)
    dataframe = pd.DataFrame.from_records(records)
    if not dataframe.empty and "_id" in dataframe.columns:
        dataframe = dataframe.drop(columns=["_id"])
    return dataframe


def build_rescue_dataframes(shelter: AnimalShelter) -> Dict[str, pd.DataFrame]:
    """Collect the dashboard's rescue-specific slices with indexed filters."""
    return {
        rescue_type: records_to_dataframe(
            shelter,
            query=AnimalShelter.build_rescue_query(rescue_type),
        )
        for rescue_type in AnimalShelter.RESCUE_BREEDS
    }


def build_breed_distribution_figure(dataframe: pd.DataFrame):
    """Create the breed distribution chart used in the dashboard."""
    if dataframe.empty or "breed" not in dataframe.columns:
        return None
    return px.pie(dataframe, names="breed", title="Breed distribution")


def summarize_map_focus(dataframe: pd.DataFrame) -> str:
    """Return the location summary for the first available animal record."""
    if dataframe.empty:
        return "No records available for map preview."

    first_record = dataframe.iloc[0]
    required_fields = {"location_lat", "location_long"}
    if not required_fields.issubset(dataframe.columns):
        return "Location fields are unavailable for map preview."

    breed = first_record.get("breed", "Unknown")
    name = first_record.get("name", "Unknown")
    return (
        f"Map would center on: {first_record['location_lat']}, "
        f"{first_record['location_long']} - {name} ({breed})"
    )