from flask import Blueprint, jsonify
from google.cloud import bigquery

# Define a Blueprint
table_schema_routes = Blueprint("table_schema_routes", __name__)

# Initialize the BigQuery client
client = bigquery.Client()
@table_schema_routes.route('/api/data/history_changesets', methods=['GET'])
def get_data_history_changesets():
    try:
        query = """
        SELECT *
        FROM `bigquery-public-data.geo_openstreetmap.history_changesets`
        LIMIT 100
        """
        query_job = client.query(query)
        
        # Load query results into a Pandas DataFrame
        df = query_job.to_dataframe()

        # Handle REPEATED (array-like) columns
        for column in df.columns:
            if isinstance(df[column].iloc[0], list):  # Check if the first element is a list
                df[column] = df[column].apply(lambda x: x if x is None else list(x))

        # Convert DataFrame to JSON and return
        return jsonify(df.to_dict(orient="records")), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# @table_schema_routes.route('/api/data/history_layers', methods=['GET'])
# def get_data_history_layers():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.history_layers`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/history_nodes', methods=['GET'])
# def get_data_history_nodes():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.history_nodes`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/history_relations', methods=['GET'])
# def get_data_history_relations():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.history_relations`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/history_ways', methods=['GET'])
# def get_data_history_ways():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.history_ways`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_changesets', methods=['GET'])
# def get_data_planet_changesets():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_changesets`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_features', methods=['GET'])
# def get_data_planet_features():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_features`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_features_points', methods=['GET'])
# def get_data_planet_features_points():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_features_points`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_layers', methods=['GET'])
# def get_data_planet_layers():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_layers`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_nodes', methods=['GET'])
# def get_data_planet_nodes():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_nodes`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_relations', methods=['GET'])
# def get_data_planet_relations():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_relations`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# @table_schema_routes.route('/api/data/planet_ways', methods=['GET'])
# def get_data_planet_ways():
#     try:
#         query = """
#         SELECT *
#         FROM `bigquery-public-data.geo_openstreetmap.planet_ways`
#         LIMIT 100
#         """
#         query_job = client.query(query)
#         df = query_job.to_dataframe()
#         return jsonify(df.to_dict(orient="records")), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


# # Function to call individual data-fetching endpoints
# @table_schema_routes.route('/api/data/fetch_all', methods=['GET'])
# def fetch_all_data():
#     try:
#         result = {}

#         # Call each endpoint individually
#         # Uncomment the desired endpoints
#         # result["history_changesets"] = get_data_history_changesets()[0].json        
#         # result["planet_changesets"] = get_data_planet_changesets()[0].json
#         # result["history_layers"] = get_data_history_layers()[0].json
#         # result["history_nodes"] = get_data_history_nodes()[0].json
#         # result["history_relations"] = get_data_history_relations()[0].json
#         # result["history_ways"] = get_data_history_ways()[0].json
#         # result["planet_changesets"] = get_data_planet_changesets()[0].json
#         # result["planet_features"] = get_data_planet_features()[0].json
#         # result["planet_features_points"] = get_data_planet_features_points()[0].json
#         # result["planet_layers"] = get_data_planet_layers()[0].json
#         # result["planet_nodes"] = get_data_planet_nodes()[0].json
#         # result["planet_relations"] = get_data_planet_relations()[0].json
#         # result["planet_ways"] = get_data_planet_ways()[0].json

#         return jsonify(result), 200
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500
