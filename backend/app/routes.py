import matplotlib
matplotlib.use('Agg') 

from flask import Blueprint, jsonify, request, send_file
from google.cloud import bigquery
import pandas as pd
import matplotlib.pyplot as plt
import io
import os

api_routes = Blueprint('api', __name__)

# Initialize BigQuery client
client = bigquery.Client()


@api_routes.route('/api/test_connection', methods=['GET'])
def test_bigquery_connection():
    try:
        # Perform a simple query
        query = """
        SELECT COUNT(*) AS total_rows
        FROM `bigquery-public-data.geo_openstreetmap.planet_features`
        """
        query_job = client.query(query)
        result = query_job.result()
        
        # Extract the result
        total_rows = next(result).total_rows
        return {"success": True, "total_rows": total_rows}, 200
    except Exception as e:
        # Handle errors
        return {"success": False, "error": str(e)}, 500

VALID_TABLES = [
    # "history_changesets",     
    # "planet_changesets", 
    "history_nodes", 
    # "history_relations", 
    # "history_ways",
    # "planet_features", 
    # "planet_features_points",
    # "planet_layers", 
    # "planet_nodes", 
    # "planet_relations", 
    # "planet_ways"
]

DATASET = "bigquery-public-data.geo_openstreetmap"  # Dataset identifier

@api_routes.route('/api/get_schema', methods=['GET'])
def get_table_schema():
    """
    Fetch schema details dynamically for all the tables in the dataset.
    """
    try:
        table_schemas = {}
        for table_name in VALID_TABLES:
            table_ref = f"{DATASET}.{table_name}"
            table = client.get_table(table_ref)  # Fetch table metadata

            # Extract schema fields
            schema = [{"name": field.name, "type": field.field_type, "mode": field.mode} for field in table.schema]
            table_schemas[table_name] = schema

        return jsonify({"success": True, "schemas": table_schemas}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/dynamic_query', methods=['POST'])
def dynamic_query():
    """
    Run a query dynamically based on the selected table and optional filters.
    """
    try:
        # Parse input
        data = request.json
        table_name = data.get("table_name")
        limit = data.get("limit", 100)

        # Validate table name
        if not table_name or table_name not in VALID_TABLES:
            return jsonify({"success": False, "error": f"Table '{table_name}' does not exist in the dataset."}), 500

        # Fetch schema for the table
        table_ref = f"{DATASET}.{table_name}"
        table = client.get_table(table_ref)

        # Extract column names dynamically
        columns = [field.name for field in table.schema]

        # Construct dynamic query
        query = f"""
        SELECT {', '.join(columns)}
        FROM `{table_ref}`
        LIMIT {limit}
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Convert GEOGRAPHY and RECORD types to string for serialization
        for field in table.schema:
            if field.field_type in ["GEOGRAPHY", "RECORD"]:
                df[field.name] = df[field.name].astype(str)

        return jsonify({"success": True, "data": df.to_dict(orient="records")}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



@api_routes.route('/api/query_all_tables', methods=['GET'])
def query_all_tables():
    """
    Fetch data from all valid tables and log the output to the console for debugging.
    Skip specific tables that are already known to work fine.
    """
    results = {}
    errors = {}
    skip_tables = ["history_changesets", "planet_changesets"]  # Skip these tables

    for table_name in VALID_TABLES:
        if table_name in skip_tables:
            print(f"Skipping table: {table_name} (already working fine)")
            continue

        print(f"Processing table: {table_name}")  # Log the table being processed
        try:
            table_ref = f"{DATASET}.{table_name}"
            table = client.get_table(table_ref)
            columns = [field.name for field in table.schema]

            # Query the table
            query = f"""
            SELECT {', '.join(columns)}
            FROM `{table_ref}`
            LIMIT 10
            """
            print(f"Querying table {table_name} with query: {query}")  # Log the query
            query_job = client.query(query)
            df = query_job.to_dataframe()

            # Convert special data types to string for serialization
            for field in table.schema:
                if field.field_type in ["GEOGRAPHY", "RECORD"]:
                    df[field.name] = df[field.name].apply(
                        lambda x: str(x) if pd.notnull(x) else None
                    )
                elif field.mode == "REPEATED":
                    df[field.name] = df[field.name].apply(
                        lambda x: list(x) if isinstance(x, (list, tuple)) else None
                    )
                elif field.field_type == "NUMERIC":
                    df[field.name] = df[field.name].apply(
                        lambda x: x if pd.notnull(x) else None
                    )

            # Replace NaN values with None for JSON serialization
            df = df.where(pd.notnull(df), None)

            # Log the result for debugging
            print(f"Results for table {table_name}:\n{df.head(10)}")
            results[table_name] = df.to_dict(orient="records")
        except Exception as e:
            # Log the error for debugging
            print(f"Error processing table {table_name}: {e}")
            errors[table_name] = str(e)

    # Log summary of results and errors
    print("\nProcessing Complete.")
    print(f"Successful tables: {list(results.keys())}")
    print(f"Errors encountered: {errors}")

    # Return a basic response to confirm the API call worked
    return jsonify({"success": True, "message": "Processing complete. Check console logs for details."}), 200




@api_routes.route('/api/validate_table/<string:table_name>', methods=['GET'])
def validate_table(table_name):
    """
    Validate if a table exists in the dataset.
    """
    try:
        if table_name not in VALID_TABLES:
            return jsonify({"success": False, "error": f"Table '{table_name}' does not exist in the dataset."}), 500

        return jsonify({"success": True, "message": f"Table '{table_name}' is valid."}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/traffic', methods=['GET'])
def get_traffic_data():
    try:
        query = """
        SELECT osm_id, feature_type, geometry
        FROM `bigquery-public-data.geo_openstreetmap.planet_features`
        LIMIT 10
        """
        query_job = client.query(query)
        results = query_job.result()

        data = [{"osm_id": row.osm_id, "feature_type": row.feature_type, "geometry": row.geometry} for row in results]
        return jsonify(data), 200
    except Exception as e:
        return {"success": False, "error": str(e)}, 500



@api_routes.route('/api/fetch_raw_data', methods=['GET'])
def fetch_raw_data():
    try:
        query = """
        SELECT osm_id, all_tags, ST_AsText(geometry) AS geometry
        FROM `bigquery-public-data.geo_openstreetmap.planet_features_lines`
        LIMIT 10
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Convert all_tags from a list of structs to a string for serialization
        df['all_tags'] = df['all_tags'].astype(str)

        data = df.to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



@api_routes.route('/api/road_type_distribution', methods=['GET'])
def road_type_distribution():
    try:
        query = """
        SELECT all_tags.key, all_tags.value
        FROM `bigquery-public-data.geo_openstreetmap.planet_features_lines`,
        UNNEST(all_tags) as all_tags
        WHERE all_tags.key = 'highway'
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Count occurrences of each highway type
        road_type_counts = df['value'].value_counts().to_dict()

        return jsonify(road_type_counts), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Route: Generate and serve visualization (Working fine)
@api_routes.route('/api/node_density_histogram', methods=['GET'])
def node_density_histogram():
    try:
        query = """
        SELECT latitude, longitude
        FROM `bigquery-public-data.geo_openstreetmap.planet_nodes`
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Create histogram
        plt.figure(figsize=(10, 6))
        plt.hist(df['latitude'], bins=30, color="skyblue", edgecolor="black")
        plt.title("Node Density by Latitude")
        plt.xlabel("Latitude")
        plt.ylabel("Frequency")

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@api_routes.route('/api/scatter_plot_lat_lon', methods=['GET'])
def scatter_plot_lat_lon():
    try:
        query = """
        SELECT latitude, longitude
        FROM `bigquery-public-data.geo_openstreetmap.planet_nodes`
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Create scatter plot
        plt.figure(figsize=(10, 6))
        plt.scatter(df['longitude'], df['latitude'], s=10, alpha=0.7)
        plt.title("Latitude vs Longitude Scatter Plot")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/road_length_distribution', methods=['GET'])
def road_length_distribution():
    try:
        query = """
        SELECT ST_Length(geometry) AS road_length
        FROM `bigquery-public-data.geo_openstreetmap.planet_features_lines`
        WHERE ST_Length(geometry) IS NOT NULL
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Create histogram
        plt.figure(figsize=(10, 6))
        plt.hist(df['road_length'], bins=30, color="green", edgecolor="black")
        plt.title("Road Length Distribution")
        plt.xlabel("Road Length (meters)")
        plt.ylabel("Frequency")

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/node_density_heatmap', methods=['GET'])
def node_density_heatmap():
    try:
        query = """
        SELECT latitude, longitude
        FROM `bigquery-public-data.geo_openstreetmap.planet_nodes`
        LIMIT 5000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Create heatmap
        plt.figure(figsize=(10, 6))
        plt.hexbin(df['longitude'], df['latitude'], gridsize=50, cmap='Reds')
        plt.title("Node Density Heatmap")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")
        plt.colorbar(label="Density")

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/road_orientation_distribution', methods=['GET'])
def road_orientation_distribution():
    try:
        query = """
        SELECT ST_Azimuth(ST_StartPoint(geometry), ST_EndPoint(geometry)) AS orientation
        FROM `bigquery-public-data.geo_openstreetmap.planet_features_lines`
        WHERE geometry IS NOT NULL
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Convert radians to degrees
        df['orientation_deg'] = df['orientation'] * (180 / 3.14159)

        # Create histogram
        plt.figure(figsize=(10, 6))
        plt.hist(df['orientation_deg'], bins=36, range=(0, 360), color="blue", edgecolor="black")
        plt.title("Road Orientation Distribution")
        plt.xlabel("Orientation (Degrees)")
        plt.ylabel("Frequency")

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/feature_type_frequency', methods=['GET'])
def feature_type_frequency():
    try:
        query = """
        SELECT value AS feature_type
        FROM `bigquery-public-data.geo_openstreetmap.planet_features_lines`,
        UNNEST(all_tags) AS tag
        WHERE tag.key = 'highway'
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        # Check if DataFrame is empty
        if df.empty:
            return jsonify({"success": False, "error": "No data available for feature type frequency"}), 404

        # Count feature types
        feature_counts = df['feature_type'].value_counts()

        # Create bar chart
        plt.figure(figsize=(10, 6))
        feature_counts.plot(kind='bar', color="orange", edgecolor="black")
        plt.title("Feature Type Frequency")
        plt.xlabel("Feature Type")
        plt.ylabel("Count")

        # Save to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_routes.route('/api/predict', methods=['POST'])
def predict_traffic():
    # Add your ML model integration here
    data = request.json
    prediction = {"prediction": "Prediction logic not yet implemented", "input": data}
    return jsonify(prediction)
