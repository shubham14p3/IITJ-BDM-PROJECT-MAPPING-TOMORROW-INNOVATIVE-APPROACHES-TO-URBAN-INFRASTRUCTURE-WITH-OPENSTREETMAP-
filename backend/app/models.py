from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TrafficData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255), nullable=False)
    traffic_density = db.Column(db.Float, nullable=False)
