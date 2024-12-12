from flask import Blueprint, jsonify, request, send_file
import matplotlib.pyplot as plt
import io
from google.cloud import bigquery

# Define the graph blueprint
graph = Blueprint("graph", __name__)
client = bigquery.Client()

# Schema mapping for each table
table_schemas = {
    "planet_nodes": "latitude, longitude",
    "planet_ways": "ST_X(ST_Centroid(geometry)) AS latitude, ST_Y(ST_Centroid(geometry)) AS longitude",
    "planet_features_points": "latitude, longitude",
    "planet_features_lines": "latitude, longitude",
    "planet_features": "latitude, longitude",  # Adjusted for features
    "history_changesets": "latitude, longitude",  # Use placeholders for compatibility
}

# Helper function: Validate table name
def validate_table(table_name):
    if table_name not in table_schemas:
        return jsonify({"success": False, "error": f"Unsupported table: {table_name}"}), 400
    return None

# Node Density Histogram
@graph.route('/api/graph/node_density_histogram', methods=['GET'])
def node_density_histogram():
    try:
        table_name = request.args.get("table_name", "planet_nodes")
        validation_error = validate_table(table_name)
        if validation_error:
            return validation_error

        query = f"""
        SELECT {table_schemas[table_name]}
        FROM `bigquery-public-data.geo_openstreetmap.{table_name}`
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        if 'latitude' not in df.columns:
            return jsonify({"success": False, "error": "Latitude column missing"}), 400

        plt.figure(figsize=(10, 6))
        plt.hist(df['latitude'], bins=30, color="skyblue", edgecolor="black")
        plt.title(f"Node Density by Latitude ({table_name})")
        plt.xlabel("Latitude (degrees)")
        plt.ylabel("Frequency")

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Scatter Plot (Latitude vs Longitude)
@graph.route('/api/graph/scatter_plot_lat_lon', methods=['GET'])
def scatter_plot_lat_lon():
    try:
        table_name = request.args.get("table_name", "planet_nodes")
        validation_error = validate_table(table_name)
        if validation_error:
            return validation_error

        query = f"""
        SELECT {table_schemas[table_name]}
        FROM `bigquery-public-data.geo_openstreetmap.{table_name}`
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        if not {'latitude', 'longitude'}.issubset(df.columns):
            return jsonify({"success": False, "error": "Latitude or Longitude column missing"}), 400

        plt.figure(figsize=(10, 6))
        plt.scatter(df['longitude'], df['latitude'], s=10, alpha=0.7)
        plt.title(f"Latitude vs Longitude Scatter Plot ({table_name})")
        plt.xlabel("Longitude (degrees)")
        plt.ylabel("Latitude (degrees)")

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Road Length Distribution
@graph.route('/api/graph/road_length_distribution', methods=['GET'])
def road_length_distribution():
    try:
        table_name = request.args.get("table_name", "planet_features_lines")
        validation_error = validate_table(table_name)
        if validation_error:
            return validation_error

        query = f"""
        SELECT ST_Length(geometry) AS road_length
        FROM `bigquery-public-data.geo_openstreetmap.{table_name}`
        WHERE ST_Length(geometry) IS NOT NULL
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        if 'road_length' not in df.columns:
            return jsonify({"success": False, "error": "Road length column missing"}), 400

        plt.figure(figsize=(10, 6))
        plt.hist(df['road_length'], bins=30, color="green", edgecolor="black")
        plt.title(f"Road Length Distribution ({table_name})")
        plt.xlabel("Road Length (meters)")
        plt.ylabel("Frequency")

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Node Density Heatmap
@graph.route('/api/graph/node_density_heatmap', methods=['GET'])
def node_density_heatmap():
    try:
        table_name = request.args.get("table_name", "planet_nodes")
        validation_error = validate_table(table_name)
        if validation_error:
            return validation_error

        query = f"""
        SELECT {table_schemas[table_name]}
        FROM `bigquery-public-data.geo_openstreetmap.{table_name}`
        LIMIT 5000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        if not {'latitude', 'longitude'}.issubset(df.columns):
            return jsonify({"success": False, "error": "Latitude or Longitude column missing"}), 400

        plt.figure(figsize=(10, 6))
        plt.hexbin(df['longitude'], df['latitude'], gridsize=50, cmap='Reds')
        plt.title(f"Node Density Heatmap ({table_name})")
        plt.xlabel("Longitude (degrees)")
        plt.ylabel("Latitude (degrees)")
        plt.colorbar(label="Density")

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Road Orientation Distribution
@graph.route('/api/graph/road_orientation_distribution', methods=['GET'])
def road_orientation_distribution():
    try:
        table_name = request.args.get("table_name", "planet_features_lines")
        validation_error = validate_table(table_name)
        if validation_error:
            return validation_error

        query = f"""
        SELECT ST_Azimuth(ST_StartPoint(geometry), ST_EndPoint(geometry)) AS orientation
        FROM `bigquery-public-data.geo_openstreetmap.{table_name}`
        WHERE geometry IS NOT NULL
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        if 'orientation' not in df.columns:
            return jsonify({"success": False, "error": "Orientation column missing"}), 400

        df['orientation_deg'] = df['orientation'] * (180 / 3.14159)

        plt.figure(figsize=(10, 6))
        plt.hist(df['orientation_deg'], bins=36, range=(0, 360), color="blue", edgecolor="black")
        plt.title(f"Road Orientation Distribution ({table_name})")
        plt.xlabel("Orientation (degrees)")
        plt.ylabel("Frequency")

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Feature Type Frequency
@graph.route('/api/graph/feature_type_frequency', methods=['GET'])
def feature_type_frequency():
    try:
        table_name = request.args.get("table_name", "planet_features_lines")
        validation_error = validate_table(table_name)
        if validation_error:
            return validation_error

        query = f"""
        SELECT value AS feature_type
        FROM `bigquery-public-data.geo_openstreetmap.{table_name}`,
        UNNEST(all_tags) AS tag
        WHERE tag.key = 'highway'
        LIMIT 1000
        """
        query_job = client.query(query)
        df = query_job.to_dataframe()

        if 'feature_type' not in df.columns:
            return jsonify({"success": False, "error": "Feature type column missing"}), 400

        feature_counts = df['feature_type'].value_counts()

        plt.figure(figsize=(10, 6))
        feature_counts.plot(kind='bar', color="orange", edgecolor="black")
        plt.title(f"Feature Type Frequency ({table_name})")
        plt.xlabel("Feature Type")
        plt.ylabel("Count")

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
