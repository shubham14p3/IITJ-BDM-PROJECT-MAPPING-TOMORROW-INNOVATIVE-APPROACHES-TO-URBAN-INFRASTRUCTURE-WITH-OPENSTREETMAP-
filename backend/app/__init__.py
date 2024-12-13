from flask import Flask
from flask_cors import CORS
from .routes import api_routes  # Ensure this matches your structure
from .table_schema import table_schema_routes
from .graphs import graph
from .road_network_graph import road_network_graph
from .map import map_routes

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register the blueprints
    app.register_blueprint(api_routes)
    app.register_blueprint(table_schema_routes)  # This now matches the Blueprint in table_schema.py
    app.register_blueprint(graph)  # This now matches the Blueprint in table_schema.py
    app.register_blueprint(road_network_graph)  # This now matches the Blueprint in raod_netowrk_graph.py
    app.register_blueprint(map_routes)  # This now matches the Blueprint in map.py
    return app
