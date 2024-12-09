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
