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
    from app.routes.catalogo_routes import catalogo_bp
    from app.routes.cuidador_routes import cuidador_bp
    from app.routes.medico_routes import medico_bp
    from app.routes.paciente_routes import paciente_bp
    from app.routes.repartidor_routes import repartidor_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(paciente_bp, url_prefix="/api/paciente")
    app.register_blueprint(medico_bp, url_prefix="/api/medico")
    app.register_blueprint(repartidor_bp, url_prefix="/api/repartidor")
    app.register_blueprint(cuidador_bp, url_prefix="/api/cuidador")
    app.register_blueprint(catalogo_bp, url_prefix="/api")

    # Errores en JSON con la clave "message" (httpClient.js la lee al fallar).
    from app.errors import ApiError

    @app.errorhandler(ApiError)
    def manejar_api_error(error):
        return {"message": error.message}, error.status_code

    @app.errorhandler(404)
    def manejar_404(_):
        return {"message": "Recurso no encontrado."}, 404

    @app.errorhandler(405)
    def manejar_405(_):
        return {"message": "Método no permitido."}, 405

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app
