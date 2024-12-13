from flask import Blueprint, jsonify, request
from google.cloud import bigquery
import folium
from shapely.geometry import mapping
import geopandas as gpd
import pandas as pd

# Initialize Blueprint
map_routes = Blueprint('map', __name__)

# Initialize BigQuery Client
client = bigquery.Client()

# Function to fetch data from BigQuery with pagination
def fetch_bigquery_data(limit=1000, offset=0):
    query = f"""
    SELECT
        osm_id,
        ST_AsText(geometry) AS geometry
    FROM
        `bigquery-public-data.geo_openstreetmap.planet_features_lines`
    WHERE
        geometry IS NOT NULL
    LIMIT {limit} OFFSET {offset}
    """
    query_job = client.query(query)
    df = query_job.to_dataframe()

    # Log data for debugging
    if df.empty:
        print(f"No data returned for LIMIT {limit} OFFSET {offset}.")
    else:
        print(f"Fetched {len(df)} rows from BigQuery.")

    return df

# Flask route to generate and return the map
@map_routes.route('/api/map', methods=['GET'])
def generate_map():
    try:
        # Read query parameters for pagination
        limit = int(request.args.get("limit", 1000))
        offset = int(request.args.get("offset", 0))

        # Fetch data
        lines_df = fetch_bigquery_data(limit=limit, offset=offset)

        # Ensure data is not empty
        if lines_df.empty:
            return jsonify({"error": "No data available to plot on the map."}), 404

        # Convert to GeoDataFrame
        lines_gdf = gpd.GeoDataFrame(
            lines_df,
            geometry=gpd.GeoSeries.from_wkt(lines_df['geometry']),
            crs="EPSG:4326"
        )

        # Create a base map
        m = folium.Map(
            location=[
                lines_gdf.geometry.centroid.y.mean(),
                lines_gdf.geometry.centroid.x.mean()
            ],
            zoom_start=12,
            tiles='OpenStreetMap'
        )

        # Add GeoJSON layers
        for _, row in lines_gdf.iterrows():
            folium.GeoJson(
                mapping(row['geometry']),
                style_function=lambda x: {'color': 'blue', 'weight': 2}
            ).add_to(m)

        # Render map as HTML
        map_html = m._repr_html_()

        # Return the map HTML directly for UI rendering
        return jsonify({"mapHtml": map_html})

    except Exception as e:
        return jsonify({"error": str(e)}), 500