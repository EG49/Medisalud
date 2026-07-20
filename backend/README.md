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

## 8. Cargar datos de ejemplo (opcional, recomendado en desarrollo)

```cmd
python seed.py
```
**Ojo: borra y recrea todas las tablas.** Carga los mismos datos que los mocks
del frontend (la paciente María Fernández, sus recetas, exámenes, pedidos, etc.),
así el dashboard se ve igual al conectarlo al backend real. El script imprime
las cédulas/celulares de prueba al final.

## API

Autenticación sin contraseña: cédula + celular + código de verificación.
**En desarrollo el código NO se envía por SMS**: se imprime en la consola de
Flask, y si el servidor corre en modo debug también viene en la respuesta
como `codigoDev`.

Las rutas protegidas requieren el header `Authorization: Bearer <token>`
(el token lo devuelve el login). Los errores siempre son `{"message": "..."}`,
que es lo que `frontend/src/api/httpClient.js` lee cuando la respuesta falla.

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/auth/registro` | Crea paciente (nombre, apellidos, cedula, celular, fecha_nacimiento) |
| POST | `/api/auth/enviar-codigo` | Genera código de verificación (cedula, celular) |
| POST | `/api/auth/login` | Valida código → `{token, usuario}` |
| GET/PUT | `/api/paciente/perfil` | Perfil del paciente (formato de `mockPerfil.js`) |
| GET | `/api/paciente/recetas` | Recetas con items (formato de `mockRecetas.js`) |
| GET | `/api/paciente/examenes` | Exámenes (formato de `mockExamenes.js`) |
| GET | `/api/paciente/pedidos` | `{activo, historial}` (formato de `mockPedidos.js`) |
| POST | `/api/paciente/pedidos` | Solicitar pedido `{direccionEntrega?, items:[{recetaItemId, farmaciaId, cantidad}]}` |
| POST | `/api/paciente/pedidos/<id>/cancelar` | Cancela (si aún no está en camino) |
| GET | `/api/paciente/notificaciones` | Notificaciones del servidor (los recordatorios son offline) |
| POST | `/api/paciente/notificaciones/<id>/leer` · `/leer-todas` | Marcar leídas |
| GET | `/api/paciente/cuidadores` | `{vinculados, solicitudesRecibidas, invitacionesEnviadas}` |
| POST | `/api/paciente/cuidadores/invitar` | Invitar por celular `{celular, relacion}` |
| POST | `/api/paciente/cuidadores/solicitudes/<id>/aprobar` · `/rechazar` | Responder solicitud |
| PATCH/DELETE | `/api/paciente/cuidadores/<id>` | Autorizar pedidos / desvincular |
| POST | `/api/cuidador/solicitar` | Pedir ser cuidador `{cedulaPaciente, relacion}` |
| GET/POST | `/api/cuidador/invitaciones` (+ `/<id>/aceptar` · `/rechazar`) | Invitaciones recibidas |
| GET | `/api/medico/pacientes?cedula=` | Buscar pacientes |
| GET | `/api/medico/pacientes/<id>` | Ficha completa (historial + recetas + exámenes) |
| POST | `/api/medico/recetas` | Crear receta con items (crea el medicamento si no existe) |
| POST | `/api/medico/recetas/items/<id>/suspender` | Suspender tratamiento (activa=false) |
| POST | `/api/medico/examenes` · `/api/medico/historial` | Registrar examen / entrada de historial |
| GET | `/api/repartidor/pedidos` | `{disponibles, asignados}` |
| POST | `/api/repartidor/pedidos/<id>/tomar` | Tomar un pedido |
| POST | `/api/repartidor/pedidos/<id>/estado` | Avanzar estado `{estado}` (solo hacia adelante) |
| GET | `/api/farmacias` · `/api/medicamentos?buscar=` | Catálogos |

Crear recetas/exámenes genera notificaciones automáticas para el paciente y
copia a sus cuidadores aprobados; los cambios de estado del pedido también.

## Notas
- El modelo de datos completo (14 tablas, con las relaciones explicadas) está documentado en `../docs/diagrama-er.md`.
- Los modelos de SQLAlchemy (`app/models/`) y el SQL puro (`db/schema.sql`) describen exactamente el mismo esquema — usa `schema.sql` si algún día necesitas crear la base sin tocar Python.
- El siguiente paso del frontend: mandar el token en el header `Authorization` desde `httpClient.js` y reemplazar cada `mock*.js` por su llamada real (cada mock indica su endpoint en el comentario de la primera línea).
