from flask import Blueprint, jsonify, send_file, request
import networkx as nx
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import contextily as ctx
import io
from google.cloud import bigquery

# Define the blueprint
road_network_graph = Blueprint("road_network_graph", __name__)
client = bigquery.Client()

@road_network_graph.route('/api/graph/road_network', methods=['GET'])
def generate_road_network_graph():
    try:
        # Extract table names and limit from query parameters
        nodes_table = request.args.get("nodes_table", "bigquery-public-data.geo_openstreetmap.planet_nodes")
        ways_table = request.args.get("ways_table", "bigquery-public-data.geo_openstreetmap.planet_ways")
        limit = int(request.args.get("limit", 1000))

        # Query planet_nodes
        nodes_query = f"""
        SELECT id, longitude, latitude
        FROM `{nodes_table}`
        LIMIT {limit}
        """
        nodes_df = client.query(nodes_query).to_dataframe()

        # Query planet_ways
        ways_query = f"""
        SELECT id, nodes
        FROM `{ways_table}`
        WHERE ARRAY_LENGTH(nodes) > 1
        LIMIT {limit}
        """
        ways_df = client.query(ways_query).to_dataframe()

        # Validate node positions
        if nodes_df.empty or not {'longitude', 'latitude'}.issubset(nodes_df.columns):
            return jsonify({"success": False, "error": "Nodes table must contain 'longitude' and 'latitude' columns."}), 400

        # Build the Network Graph
        G = nx.Graph()

        # Add nodes with positions
        for _, row in nodes_df.iterrows():
            if pd.notnull(row['longitude']) and pd.notnull(row['latitude']):
                G.add_node(row['id'], pos=(row['longitude'], row['latitude']))

        # Add edges based on connections in planet_ways
        for _, row in ways_df.iterrows():
            if isinstance(row['nodes'], list) and len(row['nodes']) > 1:
                node_ids = [node['id'] for node in row['nodes'] if 'id' in node]
                for i in range(len(node_ids) - 1):
                    if node_ids[i] in G.nodes and node_ids[i + 1] in G.nodes:
                        G.add_edge(node_ids[i], node_ids[i + 1])

        # Extract positions for plotting
        pos = nx.get_node_attributes(G, 'pos')
        if not pos:
            return jsonify({"success": False, "error": "No valid node positions available for plotting."}), 400

        # Convert node positions to GeoDataFrame
        node_positions_df = pd.DataFrame.from_dict(pos, orient="index", columns=["longitude", "latitude"])
        node_positions_gdf = gpd.GeoDataFrame(
            node_positions_df,
            geometry=gpd.points_from_xy(node_positions_df.longitude, node_positions_df.latitude),
            crs="EPSG:4326",
        ).to_crs(epsg=3857)

        # Plot the network graph
        fig, ax = plt.subplots(figsize=(12, 12))
        nx.draw_networkx_edges(G, pos, ax=ax, edge_color="skyblue", alpha=0.5)
        node_positions_gdf.plot(ax=ax, markersize=5, color="red", alpha=0.7, label="Nodes")
        ctx.add_basemap(ax, source=ctx.providers.OpenStreetMap.Mapnik)

        plt.title("Road Network Graph")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")
        plt.legend(loc="upper right")
        plt.grid(True, linestyle="--", alpha=0.3)

        # Save to memory buffer
        img = io.BytesIO()
        plt.savefig(img, format="png", bbox_inches="tight")
        img.seek(0)
        plt.close()

        return send_file(img, mimetype="image/png")

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@road_network_graph.route('/api/graph/spatial_distribution', methods=['GET'])
def spatial_distribution():
    try:
        # Extract table name from query parameters
        lines_table = request.args.get("lines_table", "bigquery-public-data.geo_openstreetmap.planet_features_lines")
        limit = int(request.args.get("limit", 1000))

        # Query planet_features_lines
        query = f"""
        SELECT geometry
        FROM `{lines_table}`
        LIMIT {limit}
        """
        lines_df = client.query(query).to_dataframe()

        # Convert geometry to GeoDataFrame
        if 'geometry' not in lines_df.columns:
            return jsonify({"success": False, "error": "Missing 'geometry' column in the dataset"}), 400

        lines_gdf = gpd.GeoDataFrame(
            lines_df,
            geometry=gpd.GeoSeries.from_wkt(lines_df['geometry']),
            crs="EPSG:4326"
        ).to_crs(epsg=3857)

        # Plot spatial distribution
        fig, ax = plt.subplots(figsize=(12, 8))
        lines_gdf.plot(ax=ax, color='dodgerblue', linewidth=0.8, alpha=0.7, label='Roads')
        ctx.add_basemap(ax, source=ctx.providers.OpenStreetMap.Mapnik)

        plt.title("Spatial Distribution of Roads")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")
        plt.legend(loc="upper right")
        plt.grid(True, linestyle="--", alpha=0.3)

        # Save to memory buffer
        img = io.BytesIO()
        plt.savefig(img, format="png", bbox_inches="tight")
        img.seek(0)
        plt.close()

        return send_file(img, mimetype="image/png")

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

