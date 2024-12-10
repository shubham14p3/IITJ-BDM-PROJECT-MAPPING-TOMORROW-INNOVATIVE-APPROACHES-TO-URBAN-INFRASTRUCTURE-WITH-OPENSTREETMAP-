from flask import Flask
from flask_cors import CORS
from .routes import api_routes  # Ensure this matches your structure
from .table_schema import table_schema_routes

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register the blueprints
    app.register_blueprint(api_routes)
    app.register_blueprint(table_schema_routes)  # This now matches the Blueprint in table_schema.py
    return app
