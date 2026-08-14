# CS-340 Grazioso Salvare Dashboard Enhancements

This artifact enhances the original CS-340 Grazioso Salvare MongoDB dashboard with stronger CRUD handling, schema validation, safer configuration, and cleaner notebook organization.

## Included Files

- `ProjectOne_CRUD_Python_Module.py`: enhanced MongoDB CRUD module
- `ProjectTwoDashboard.ipynb`: updated dashboard notebook
- `dashboard_helpers.py`: reusable notebook helper functions
- `requirements.txt`: Python dependencies for the artifact

## Enhancements Completed

### 1. Improved CRUD Operations

- Added validation for create, read, update, and delete inputs
- Prevented destructive deletes without a query filter
- Required MongoDB update operators such as `$set` for updates
- Returned safe defaults when operations fail

### 2. Added Schema Validation

- Enforced required animal fields before inserts
- Checked data types for strings and numeric location and age fields
- Added a reusable validation example in the notebook

### 3. Improved Query Efficiency

- Added indexes for breed, age, and location fields used by dashboard filters
- Added projections and row limits for notebook queries
- Replaced repeated inline queries with a reusable rescue query builder

### 4. Modularized the Notebook

- Moved repeated dataframe and visualization logic into `dashboard_helpers.py`
- Reduced notebook code to setup, filtered retrieval, and presentation steps

### 5. Strengthened Security Practices

- Removed hardcoded MongoDB credentials from the notebook
- Read connection values from environment variables
- Added query and document validation to reduce unsafe input patterns

### 6. Added Documentation

- Added inline comments and docstrings for database and dashboard helper functions
- Documented setup and enhancement details in this README

### 7. Added Focused Validation Tests

- Added unit tests for dashboard-safe query validation
- Added unit tests for the allowed `$set` update path and rejected update operators
- Added unit tests that reject unsupported query and update fields outside the dashboard scope

## Environment Variables

Set these before running the notebook:

- `AAC_MONGO_USERNAME`
- `AAC_MONGO_PASSWORD`
- `AAC_MONGO_HOST` (optional, defaults to `localhost`)
- `AAC_MONGO_PORT` (optional, defaults to `27017`)
- `AAC_MONGO_DB` (optional, defaults to `aac`)
- `AAC_MONGO_COLLECTION` (optional, defaults to `animals`)

Example in PowerShell:

```powershell
$env:AAC_MONGO_USERNAME = "your_username"
$env:AAC_MONGO_PASSWORD = "your_password"
$env:AAC_MONGO_HOST = "localhost"
$env:AAC_MONGO_PORT = "27017"
$env:AAC_MONGO_DB = "aac"
$env:AAC_MONGO_COLLECTION = "animals"
```

## How to Run

1. Install the dependencies from `requirements.txt`.
2. Set the MongoDB environment variables shown above.
3. Open `ProjectTwoDashboard.ipynb` in VS Code or Jupyter.
4. Run the first code cell to connect and load the datasets.
5. Run the second code cell to display rescue previews, the breed chart, and the validation example.

## Run Tests

Run the focused CRUD validation tests from the project folder:

```powershell
python -m unittest test_animal_shelter.py
```

## Submission Notes

Your submission ZIP should include the original artifact files plus the enhanced notebook, the new helper module, this README, and `requirements.txt`.