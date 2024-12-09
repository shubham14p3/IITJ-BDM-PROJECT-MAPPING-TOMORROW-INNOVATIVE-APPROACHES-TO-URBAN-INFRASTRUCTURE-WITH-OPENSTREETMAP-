from flask import Flask
from flask_cors import CORS
from .routes import api_routes  # Ensure this matches your structure

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register the blueprint
    app.register_blueprint(api_routes)

    return app
