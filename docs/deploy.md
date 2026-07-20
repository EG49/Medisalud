# Deploy automático — configuración inicial (una sola vez)

El pipeline de `.github/workflows/ci.yml` ya está listo para desplegar
automáticamente, pero necesita que **tú** conectes las cuentas de Vercel y
Render primero, y que guardes algunos datos como "secrets" en GitHub.

## 1. Frontend → Vercel

1. Crea una cuenta en https://vercel.com (puedes entrar con tu GitHub)
2. **"Add New" → "Project"** → importa tu repositorio
3. En la configuración del proyecto, cuando te pida el *Root Directory*,
   selecciona `frontend` (no la raíz del repo)
4. Antes de darle deploy la primera vez, agrega la variable de entorno:
   - `VITE_API_URL` = la URL de tu backend en Render (la vas a tener después
     del paso 2 -- puedes dejarla vacía por ahora y volver a este paso)
5. Consigue los 3 datos que pide el workflow:
   - **VERCEL_TOKEN**: en Vercel → tu foto de perfil → *Settings* →
     *Tokens* → *Create Token*
   - **VERCEL_ORG_ID** y **VERCEL_PROJECT_ID**: instala la CLI de Vercel
     localmente (`npm i -g vercel`), corre `vercel link` dentro de
     `frontend/`, y esos dos valores quedan guardados en
     `frontend/.vercel/project.json`

## 2. Backend → Render

1. Crea una cuenta en https://render.com
2. **"New +" → "PostgreSQL"** → esto crea tu base de datos en producción.
   Copia el **Internal Database URL** que te da (lo vas a usar como
   `DATABASE_URL`)
3. **"New +" → "Web Service"** → conecta el mismo repositorio de GitHub
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
4. En la sección *Environment* del servicio, agrega:
   - `DATABASE_URL` = el que copiaste en el paso 2
   - `SECRET_KEY` = cualquier cadena larga y aleatoria
5. Crea las tablas en esa base de producción **una sola vez**, corriendo
   localmente (con tu `psql`) contra el `External Database URL` que te da
   Render:
   ```
   psql "postgresql://usuario:password@host-externo/db" -f backend/db/schema.sql
   ```
6. Consigue el **Deploy Hook**: en el servicio → *Settings* → *Deploy Hook*
   → copia la URL

## 3. Guardar los secrets en GitHub

En tu repositorio de GitHub: **Settings → Secrets and variables → Actions
→ New repository secret**. Agrega estos 4:

| Nombre | De dónde sale |
|---|---|
| `VERCEL_TOKEN` | Paso 1.5 |
| `VERCEL_ORG_ID` | Paso 1.5 |
| `VERCEL_PROJECT_ID` | Paso 1.5 |
| `RENDER_DEPLOY_HOOK_URL` | Paso 2.6 |

## 4. Probarlo

Haz cualquier cambio pequeño, commitea y sube a `main`. En la pestaña
**Actions** de GitHub deberías ver los 4 jobs corriendo: primero las 2
pruebas, y si ambas pasan, los 2 deploys en paralelo.

## Nota importante sobre costos
Tanto Vercel como Render tienen planes gratuitos suficientes para una demo
o proyecto en desarrollo -- pero Render en su plan free **apaga el
servicio backend si no recibe tráfico por un rato**, y tarda ~30-60
segundos en "despertar" con la primera petición después de estar inactivo.
Es normal, no es un error.
