from flask import Blueprint, jsonify
from google.cloud import bigquery
import pandas as pd
import numpy as np

# Define a Blueprint
table_schema_routes = Blueprint("table_schema_routes", __name__)

# Initialize the BigQuery client
client = bigquery.Client()

#history_changesets
@table_schema_routes.route('/api/data/history_changesets', methods=['GET'])
def get_data_history_changesets():
    try:
        # Query to retrieve data
        query = """
        SELECT *
        FROM `bigquery-public-data.geo_openstreetmap.history_changesets`
        LIMIT 100
        """
        query_job = client.query(query)

        # Load query results into a Pandas DataFrame
        df = query_job.to_dataframe()

        # Handle REPEATED columns (relations, ways, nodes)
        for column in ['relations', 'ways', 'nodes']:
            if column in df.columns:
                df[column] = df[column].apply(lambda x: x if isinstance(x, list) else [])

        # Ensure all columns are JSON serializable
        df = df.replace({np.nan: None})  # Replace NaN with None for JSON compatibility

        # Convert DataFrame to JSON and return
        return jsonify(df.to_dict(orient="records")), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@table_schema_routes.route('/api/data/planet_features', methods=['GET'])
def get_data_planet_features():
    try:
        # Query to fetch data
        query = """
        SELECT
          feature_type,
          osm_id,
          osm_way_id,
          osm_version,
          osm_timestamp,
          ST_AsText(geometry) AS geometry,
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
            WHERE key IS NOT NULL AND value IS NOT NULL
          ) AS tags
        FROM
          `bigquery-public-data.geo_openstreetmap.planet_features`
        LIMIT 10;
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Process the 'tags' field for better serialization
        def process_tags(tags):
            if tags is None or len(tags) == 0:
                return []
            return [{"key": tag["key"], "value": tag["value"]} for tag in tags]

        # Apply `process_tags` to the 'tags' column
        if "tags" in df.columns:
            df["tags"] = df["tags"].apply(process_tags)

        # Replace NaN with None for JSON compatibility
        df = df.replace({pd.NA: None})

        # Debug: Print processed DataFrame
        print("Processed DataFrame with Tags:")
        print(df)

        # Convert DataFrame to JSON serializable dictionary
        response_data = df.to_dict(orient="records")

        # Debug: Print serialized response
        print("Serialized Response:")
        print(response_data)

        return jsonify(response_data), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500




@table_schema_routes.route('/api/data/planet_features_lines', methods=['GET'])
def get_data_planet_features_lines():
    try:
        # Adjusted query with proper handling of all_tags
        query = """
        SELECT
          osm_id,
          osm_version,
          osm_way_id,
          osm_timestamp,
          ST_AsText(geometry) AS geometry, -- Convert geometry to readable text
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
          ) AS tags -- Preserve tags as an array of STRUCTs
        FROM
          `bigquery-public-data.geo_openstreetmap.planet_features_lines`
        LIMIT 100;
        """
        query_job = client.query(query)

        # Load query results into a Pandas DataFrame
        df = query_job.to_dataframe()

        # Define a robust tags_to_dict function
        def tags_to_dict(tag_array):
            if not isinstance(tag_array, list) or len(tag_array) == 0:
                return {}
            return {tag["key"]: tag["value"] for tag in tag_array if "key" in tag and "value" in tag}

        # Apply the tags_to_dict function safely
        if 'tags' in df.columns:
            df['tags'] = df['tags'].apply(tags_to_dict)

        # Ensure all columns are JSON serializable
        df = df.replace({pd.NA: None})  # Replace NA/NULL with None

        # Convert DataFrame to JSON and return
        return jsonify(df.to_dict(orient="records")), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



@table_schema_routes.route('/api/data/planet_features_points', methods=['GET'])
def get_data_planet_features_points():
    try:
        query = """
        SELECT
          osm_id,
          osm_version,
          osm_way_id,
          osm_timestamp,
          ST_AsText(geometry) AS geometry,
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
            WHERE key IS NOT NULL AND value IS NOT NULL
          ) AS tags
        FROM `bigquery-public-data.geo_openstreetmap.planet_features_points`
        LIMIT 100
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Process the 'tags' field for better serialization
        def process_tags(tags):
            if tags is None or len(tags) == 0:
                return []
            return [{"key": tag["key"], "value": tag["value"]} for tag in tags]

        if "tags" in df.columns:
            df["tags"] = df["tags"].apply(process_tags)

        return jsonify(df.to_dict(orient="records")), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500





@table_schema_routes.route('/api/data/planet_layers', methods=['GET'])
def get_data_planet_layers():
    try:
        # Query to fetch data
        query = """
        SELECT
          layer_code,
          layer_class,
          layer_name,
          gdal_type,
          osm_id,
          osm_way_id,
          osm_timestamp,
          osm_version,
          ST_AsText(geometry) AS geometry,
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
            WHERE key IS NOT NULL AND value IS NOT NULL
          ) AS tags
        FROM `bigquery-public-data.geo_openstreetmap.planet_layers`
        LIMIT 100
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Debug: Print raw DataFrame
        print("Raw DataFrame:")
        print(df)

        # Process the 'tags' field for better serialization
        def process_tags(tags):
            if tags is None or len(tags) == 0:
                return []
            return [{"key": tag["key"], "value": tag["value"]} for tag in tags]

        if "tags" in df.columns:
            df["tags"] = df["tags"].apply(process_tags)

        # Replace NaN with None for JSON compatibility
        df = df.replace({pd.NA: None})

        # Convert DataFrame to JSON serializable dictionary
        response_data = df.to_dict(orient="records")

        # Debug: Print serialized response
        print("Serialized Response:")
        print(response_data)

        return jsonify(response_data), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500




@table_schema_routes.route('/api/data/planet_nodes', methods=['GET'])
def get_data_planet_nodes():
    try:
        # Query to retrieve data
        query = """
        SELECT
          id,
          version,
          username,
          changeset,
          visible,
          osm_timestamp,
          latitude,
          longitude,
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
          ) AS tags -- Combine all_tags.key and all_tags.value into a structured array
        FROM
          `bigquery-public-data.geo_openstreetmap.planet_nodes`
        LIMIT 100;
        """
        query_job = client.query(query)

        # Load query results into a Pandas DataFrame
        df = query_job.to_dataframe()

        # Define a function to convert tags to a dictionary
        def tags_to_dict(tag_array):
            if not isinstance(tag_array, list) or len(tag_array) == 0:
                return {}
            return {tag["key"]: tag["value"] for tag in tag_array if "key" in tag and "value" in tag}

        # Apply the tags_to_dict function to the 'tags' column
        if 'tags' in df.columns:
            df['tags'] = df['tags'].apply(tags_to_dict)

        # Ensure all columns are JSON serializable
        df = df.replace({pd.NA: None})  # Replace NA/NULL with None

        # Convert DataFrame to JSON and return
        return jsonify(df.to_dict(orient="records")), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@table_schema_routes.route('/api/data/planet_relations', methods=['GET'])
def get_data_planet_relations():
    try:
        # SQL query to fetch data from BigQuery
        query = """
        SELECT
          id,
          version,
          username,
          changeset,
          visible,
          osm_timestamp,
          ST_AsText(geometry) AS geometry,
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
            WHERE key IS NOT NULL AND value IS NOT NULL
          ) AS all_tags,
          ARRAY(
            SELECT AS STRUCT type, id, role
            FROM UNNEST(members)
            WHERE id IS NOT NULL
          ) AS members
        FROM `bigquery-public-data.geo_openstreetmap.planet_relations`
        LIMIT 100
        """
        
        # Run the query and load data into a DataFrame
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Debugging: Print raw DataFrame
        print("Raw DataFrame from BigQuery:")
        print(df.head())

        # Function to process the 'all_tags' field
        def process_all_tags(tags):
            if isinstance(tags, list) and tags:
                return [{"key": tag.get("key"), "value": tag.get("value")} for tag in tags if tag.get("key") and tag.get("value")]
            return []

        # Function to process the 'members' field
        def process_members(members):
            if isinstance(members, list) and members:
                return [{"type": member.get("type"), "id": member.get("id"), "role": member.get("role")} for member in members if member.get("id")]
            return []

        # Apply processing functions
        if "all_tags" in df.columns:
            df["all_tags"] = df["all_tags"].apply(process_all_tags)
        if "members" in df.columns:
            df["members"] = df["members"].apply(process_members)

        # Replace NaN with None for JSON compatibility
        df = df.replace({pd.NA: None})

        # Convert DataFrame to a JSON serializable dictionary
        response_data = df.to_dict(orient="records")

        # Debugging: Print serialized response data
        print("Serialized Response Data:")
        print(response_data)

        return jsonify(response_data), 200

    except Exception as e:
        # Handle and log exceptions
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500





@table_schema_routes.route('/api/data/planet_ways', methods=['GET'])
def get_data_planet_ways():
    try:
        query = """
        SELECT
          id,
          version,
          username,
          changeset,
          visible,
          osm_timestamp,
          ST_AsText(geometry) AS geometry,
          ARRAY(
            SELECT AS STRUCT key, value
            FROM UNNEST(all_tags)
            WHERE key IS NOT NULL AND value IS NOT NULL
          ) AS all_tags,
          ARRAY(
            SELECT AS STRUCT id
            FROM UNNEST(nodes)
            WHERE id IS NOT NULL
          ) AS nodes
        FROM `bigquery-public-data.geo_openstreetmap.planet_ways`
        LIMIT 100
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Debugging: Print raw DataFrame
        print("Raw DataFrame from BigQuery:")
        print(df.head())

        # Process 'all_tags' field for better serialization
        def process_all_tags(tags):
            if isinstance(tags, list) and tags:
                return [{"key": tag.get("key"), "value": tag.get("value")} for tag in tags]
            return []

        # Process 'nodes' field for better serialization
        def process_nodes(nodes):
            if isinstance(nodes, list) and nodes:
                return [node.get("id") for node in nodes]
            return []

        # Apply processing functions
        if "all_tags" in df.columns:
            df["all_tags"] = df["all_tags"].apply(process_all_tags)
        if "nodes" in df.columns:
            df["nodes"] = df["nodes"].apply(process_nodes)

        # Replace NaN with None for JSON compatibility
        df = df.replace({pd.NA: None})

        # Convert DataFrame to JSON serializable dictionary
        response_data = df.to_dict(orient="records")

        # Debugging: Print serialized response data
        print("Serialized Response Data:")
        print(response_data)

        return jsonify(response_data), 200

    except Exception as e:
        # Handle and log exceptions
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500





# Function to call individual data-fetching endpoints
@table_schema_routes.route('/api/data/fetch_all', methods=['GET'])
def fetch_all_data():
    try:
        result = {}

        # Call each endpoint individually
        # Uncomment the desired endpoints
        result["history_changesets"] = get_data_history_changesets()[0].json 
        result["planet_features_lines"] = get_data_planet_features_lines()[0].json
        result["planet_features"] = get_data_planet_features()[0].json
        result["planet_features_points"] = get_data_planet_features_points()[0].json
        result["planet_layers"] = get_data_planet_layers()[0].json
        result["planet_nodes"] = get_data_planet_nodes()[0].json
        result["planet_relations"] = get_data_planet_relations()[0].json
        result["planet_ways"] = get_data_planet_ways()[0].json

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
