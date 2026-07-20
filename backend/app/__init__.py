from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, migrate


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)  # permite que el frontend (Vite, otro puerto) llame a la API

    # Importa los modelos para que Flask-Migrate los detecte al generar migraciones.
    from app import models  # noqa: F401

    from app.routes.auth_routes import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app
