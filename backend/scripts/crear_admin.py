"""
Crea una cuenta de Admin. Se corre a mano, directo en el servidor/tu máquina
-- a propósito NO existe un endpoint HTTP para esto, para que nadie pueda
crear un admin desde afuera.

Uso:
    python scripts/crear_admin.py
"""
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.extensions import db
from app.models import Usuario
from app.models.enums import RolUsuario


def main():
    app = create_app()
    with app.app_context():
        nombre = input("Nombre: ").strip()
        apellidos = input("Apellidos: ").strip()
        cedula = input("Cédula: ").strip()
        celular = input("Celular: ").strip()

        if Usuario.query.filter_by(cedula=cedula).first():
            print("Ya existe un usuario con esa cédula. Cancelado.")
            return

        admin = Usuario(
            nombre=nombre,
            apellidos=apellidos,
            cedula=cedula,
            celular=celular,
            rol=RolUsuario.admin,
        )
        db.session.add(admin)
        db.session.commit()
        print(f"Admin creado: {admin.nombre} {admin.apellidos} ({admin.id})")


if __name__ == "__main__":
    main()
