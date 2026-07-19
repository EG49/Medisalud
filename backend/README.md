# MediSalud — Backend (Flask + PostgreSQL)

## 1. Instalar PostgreSQL

**Windows**: descarga el instalador desde https://www.postgresql.org/download/windows/
Durante la instalación te pedirá una contraseña para el usuario `postgres` — anótala.

Verifica que quedó instalado:
```cmd
psql --version
```

## 2. Crear la base de datos y el usuario de la app

Abre `psql` (o pgAdmin, que se instala junto con Postgres) y ejecuta:

```sql
CREATE USER medisalud_user WITH PASSWORD 'medisalud_pass';
CREATE DATABASE medisalud_db OWNER medisalud_user;
GRANT ALL PRIVILEGES ON DATABASE medisalud_db TO medisalud_user;
```

Para entrar a `psql` desde cmd:
```cmd
psql -U postgres
```
(te va a pedir la contraseña que pusiste en el paso 1)

## 3. Configurar el entorno de Python

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Configurar la conexión

```cmd
copy .env.example .env
```
Abre `.env` y ajusta `DATABASE_URL` si usaste un usuario/contraseña distinto al del paso 2. El formato es:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
```

## 5. Crear las tablas

Tienes dos formas — elige una:

**Opción A — Flask-Migrate (recomendada, deja historial de cambios futuros):**
```cmd
flask db init
flask db migrate -m "Esquema inicial"
flask db upgrade
```

**Opción B — Ejecutar el SQL directo** (`db/schema.sql`), si prefieres crear las tablas de una vez sin pasar por migraciones:
```cmd
psql -U medisalud_user -d medisalud_db -f db/schema.sql
```

## 6. Levantar el servidor

```cmd
python run.py
```

Deberías ver el servidor corriendo en `http://localhost:5000`. Pruébalo:
```cmd
curl http://localhost:5000/api/health
```
Debe responder `{"status": "ok"}`.

## 7. Conectar con el frontend

En `frontend/.env` (créalo si no existe), agrega:
```
VITE_API_URL=http://localhost:5000/api
```
Eso es lo que ya está esperando `frontend/src/api/httpClient.js` desde que lo armamos.

## Verificar que las tablas se crearon bien
```cmd
psql -U medisalud_user -d medisalud_db -c "\dt"
```
Deberías ver las 14 tablas listadas.

## Notas
- El modelo de datos completo (14 tablas, con las relaciones explicadas) está documentado en `../docs/diagrama-er.md`.
- Los modelos de SQLAlchemy (`app/models/`) y el SQL puro (`db/schema.sql`) describen exactamente el mismo esquema — usa `schema.sql` si algún día necesitas crear la base sin tocar Python.
- Todavía no hay rutas (`app/routes/`) ni lógica de negocio (`app/services/`) — eso es el siguiente paso.
