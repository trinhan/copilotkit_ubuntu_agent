import pytest
import os
import json
import dotenv
from google.cloud import bigquery
from google.oauth2 import service_account
from agent import bq_search_agent
from prompt import PROJECT_ID, DATASET_ID, TABLE_ID

# Load environment variables
dotenv.load_dotenv()

@pytest.fixture
def bq_client():
    """Provides a BigQuery client using the same environment as the agent."""
    return bigquery.Client()

def test_print_env_variables():
    """Verify and print specific variables in the .env file."""
    location = os.getenv("GOOGLE_CLOUD_LOCATION")
    project = os.getenv("GOOGLE_CLOUD_PROJECT")
    print(f"\n--- Environment Variables ---")
    print(f"GOOGLE_CLOUD_LOCATION: {location}")
    print(f"GOOGLE_CLOUD_PROJECT: {project}")
    print(f"GOOGLE_CLOUD_PROJECT: {project}")
    assert location is not None, "GOOGLE_CLOUD_LOCATION is not set in .env"

def test_print_service_account():
    """Read the service key from GOOGLE_APPLICATION_CREDENTIALS and print the service account email."""
    # Read the key path from the global environment variable
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    assert key_path is not None, "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set"
    assert os.path.exists(key_path), f"Service key file not found at {key_path}"
    
    with open(key_path, 'r') as f:
        key_data = json.load(f)
        client_email = key_data.get("client_email")
        print(f"\n--- Service Account Info ---")
        print(f"Service Account Email: {client_email}")
        assert client_email is not None

def test_bigquery_permissions(bq_client):
    """1. I have permissions to access the bigquery table"""
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    try:
        # metadata check is a good permission test
        table = bq_client.get_table(table_ref)
        assert table.table_id == TABLE_ID
        print(f"\nSuccessfully accessed table: {table_ref}")
    except Exception as e:
        pytest.fail(f"Permissions check failed: {e}")

def test_bigquery_return_first_entry(bq_client):
    """2. I can return the first entry in the biquery table"""
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    query = f"SELECT * FROM `{table_ref}` LIMIT 1"
    expected_title = "Why my Flask application on my Ubuntu Apache server get ERR_CONNECTION_REFUSED?"
    try:
        query_job = bq_client.query(query)
        results = list(query_job.result())
        assert len(results) > 0
        actual_title = results[0].get('title')
        print(f"\nSuccessfully retrieved first entry: {actual_title}")
        assert actual_title == expected_title
    except Exception as e:
        pytest.fail(f"Failed to retrieve first entry: {e}")

# Note: Keeping the agent test commented out for now as it requires complex async context mocking
# and the user specifically asked for the above checks.
# @pytest.mark.asyncio
# async def test_agent_retrieve_specific_title():
#     ...
