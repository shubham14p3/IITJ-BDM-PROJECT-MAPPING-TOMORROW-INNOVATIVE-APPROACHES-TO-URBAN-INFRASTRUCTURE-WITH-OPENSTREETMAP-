import os

class Config:
    # Flask Configuration
    DEBUG = True  # Set to False in production
    SECRET_KEY = os.environ.get('SECRET_KEY', 'source venv/Scripts/activate
')

    # Google BigQuery Configuration
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get(
        'GOOGLE_APPLICATION_CREDENTIALS', 'keyfile.json'
    )

    # Dataset Configuration
    BIGQUERY_PROJECT = 'bigquery-public-data'  # Public data project
    BIGQUERY_DATASET = 'geo_openstreetmap'    # Dataset ID
