import os


class Config:
    """Configuración base. Todo sensible viene de variables de entorno (.env),
    nunca hardcodeado -- así el mismo código sirve para local/producción."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "cambia-esto-en-produccion")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://medisalud_user:medisalud_pass@localhost:5432/medisalud_db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestConfig(Config):
    """Usada solo en pytest/CI -- SQLite en memoria, no necesita Postgres
    corriendo. No usar esto para nada que no sea pruebas automatizadas."""

    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
