from flask import Blueprint, jsonify, request
from google.cloud import bigquery

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

@api_routes.route('/api/predict', methods=['POST'])
def predict_traffic():
    # Add your ML model integration here
    data = request.json
    prediction = {"prediction": "Prediction logic not yet implemented", "input": data}
    return jsonify(prediction)
