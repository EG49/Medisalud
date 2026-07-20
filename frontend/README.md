# MediSalud — Frontend (Login)

## Cómo correr

```bash
npm install
npm run dev
```

Luego abre `http://localhost:5173`.

## Qué incluye esta entrega
- Estructura completa acordada (`atoms/molecules/organisms/templates/pages`, `features/`, `offline/`)
- Design tokens (`src/styles/tokens.css`) con la paleta definida
- Página de **Login** completa: `Header`, hero con ilustración + `LoginForm`, `Footer`
- Capa `api/` con `authApi.js` apuntando a Flask (`/api/auth/enviar-codigo`, `/api/auth/login`) — hoy son endpoints que aún no existen en el backend, se conectan cuando armemos `auth_routes.py`

## Decisiones tomadas respecto al diseño de Figma
1. **Un botón = una acción.** En el header, el botón combinado "Ingresar / o / Registrarse" se separó en dos controles independientes (accesibilidad — un control no debe disparar dos acciones distintas).
2. **Labels asociados al input** (`htmlFor`/`id`) en vez de texto superpuesto de forma absoluta, para que funcionen con lectores de pantalla.
3. **Layout responsivo** (flex/grid) en vez de posiciones absolutas fijas a 1280px, para que funcione en tablets/celulares — importante dado que muchos cuidadores acceden desde el móvil.
4. La imagen `abuelo.png` no estaba adjunta como archivo — se referencia en `/public/assets/abuelo.png`, agrégala ahí.

## Pendiente (próximos pasos)
- Conectar `enviarCodigo` / `iniciarSesion` a un backend Flask real
- Ajustar contraste de colores a WCAG (pendiente, como se acordó)
- Página de Registro
- `AuthContext` + `RoleGuard` para las rutas internas por rol
