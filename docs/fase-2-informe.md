# MediSalud — Informe de Fase 2

**Implementación, Testing Automatizado y Despliegue CI/CD**
Materia: Diseño de Sistemas / Ingeniería de Software 2 — Semestre I 2026

---

## Sección 5 — Sistema funcional, Service Workers y parámetros PWA

### Sistema funcional

El sistema quedó conectado de punta a punta:

- **Backend Flask + SQLAlchemy** (`backend/`): autenticación sin contraseña (cédula + celular + código de verificación), módulos de paciente (perfil, recetas, exámenes, pedidos, notificaciones, cuidadores), médico, repartidor y catálogos. La API completa está documentada en `backend/README.md` y verificada con 41 requests de prueba end-to-end.
- **Frontend React (Vite)** conectado a la API real: los antiguos `mock*.js` dejaron de ser la fuente de datos de las pantallas y ahora funcionan como **respaldo de modo demo/offline**. La capa `src/api/` (httpClient con token de sesión, `pacienteApi`, hook `useApi`) intenta siempre el backend y, si el servidor no responde, la app muestra datos de ejemplo en vez de romperse — decisión clave de resiliencia para el público adulto mayor.
- **Sesión persistente**: el login guarda token y usuario en `localStorage`; al reabrir la app (o instalada como PWA) el paciente entra directo a su dashboard sin volver a autenticarse.

### Service Worker y parámetros PWA

Implementado con `vite-plugin-pwa` (Workbox), configurado en `frontend/vite.config.js`:

- **Manifest**: nombre "MediSalud — Salud sin barreras", `display: standalone`, orientación vertical, íconos 192/512 px (incluido `maskable`), tema `#0d7a6c`, idioma `es`. La app es **instalable** en el teléfono/escritorio.
- **Precaché**: todo el build (HTML, JS, CSS e imágenes — 36 recursos) queda precacheado, por lo que la aplicación **abre sin conexión**.
- **Datos offline**: las llamadas a `/api/` usan estrategia **NetworkFirst** con timeout de 4 s — si hay red se muestran datos frescos; si no, la última copia buena guardada (recetas y dosis siguen visibles sin internet, y el cálculo de "medicina disponible" es 100 % local por diseño).
- **Actualización automática** (`registerType: autoUpdate`): al haber una versión nueva deployada, el Service Worker se actualiza solo — el adulto mayor nunca tiene que "actualizar la app".

## Sección 6 — Cobertura de código y pruebas E2E

### Pruebas unitarias (Jest + Testing Library)

Suite de **93 pruebas en 10 archivos** (`npm run test:coverage`), que cubre la lógica de negocio del cliente (`medicineAvailability`, `dateGrouping`), toda la capa de API (`httpClient`, `authApi`, `pacienteApi`, `useApi` — incluidos los casos de error de red y el modo demo) y los componentes de Atomic Design (átomos y moléculas, incluyendo estados de accesibilidad y ramas de borde).

Resultado (umbral exigido: 80 % — configurado como bloqueo en `jest.config.cjs`, si baja de 80 % la suite falla):

| Métrica | Cobertura |
|---|---|
| Statements | **99.1 %** |
| Branches | **94.0 %** |
| Functions | **100 %** |
| Lines | **99.5 %** |

El reporte HTML completo se genera en `frontend/coverage/` y se publica como artefacto (`reporte-cobertura`) en cada ejecución del pipeline.

### Pruebas del backend (pytest)

Suite de **17 pruebas** en `backend/tests/` que corren sobre SQLite en memoria (no necesitan PostgreSQL): registro por rol (paciente/médico/repartidor), bloqueo del registro público de `admin`, ciclo completo de código de verificación (incluido expiración y un solo uso), duplicados de cédula/celular, protección de rutas por token y por rol, y el flujo médico → receta → paciente con su notificación.

### Pruebas E2E (Cypress)

Tres flujos críticos contra el **backend real** (Flask + seed), en `frontend/cypress/e2e/`:

1. **Autenticación** (`flujo_autenticacion.cy.js`): registro de un usuario nuevo por UI, login con el código de verificación real y rechazo de códigos incorrectos.
2. **Recetas y medicinas** (`flujo_recetas.cy.js`): la paciente ve sus recetas emitidas por médicos, las dosis disponibles calculadas y los exámenes con explicación simple.
3. **Solicitar pedido** (`flujo_pedido.cy.js`): ciclo completo del negocio — el repartidor entrega el pedido en curso, la paciente solicita una nueva entrega y ve el seguimiento en estado "Solicitado".

Se ejecutan en cada push/PR dentro del pipeline (job `pruebas-e2e`), con el backend sembrado con los mismos datos que usaba el prototipo. Las capturas de fallos se suben como artefacto.

## Sección 7 — Métricas de rendimiento (Lighthouse) y estándares

El pipeline incluye un job `lighthouse` que audita automáticamente el sitio publicado (`https://eg49.github.io/Medisalud/`) después de cada deploy y publica el reporte como artefacto (`reporte-lighthouse`).

Comparativa a completar con los reportes del pipeline (baseline = build sin PWA de la Fase 1, actual = build PWA desplegado):

| Métrica Lighthouse | Antes (sin PWA) | Después (PWA) |
|---|---|---|
| Performance | _completar_ | _completar_ |
| Accessibility | _completar_ | _completar_ |
| Best Practices | _completar_ | _completar_ |
| SEO | _completar_ | _completar_ |

Cumplimiento de estándares aplicado en el código:

- **WCAG 2.1**: labels asociados a inputs (`htmlFor`/`id`), roles ARIA (`progressbar`, `status`, `aria-current`, `aria-label` en secciones), áreas de clic amplias y navegación simplificada — verificado además por pruebas unitarias que consultan el DOM por roles accesibles.
- **PWA instalable**: manifest completo + Service Worker + íconos maskable + `theme-color`.
- **Meta descripción e idioma** declarados para SEO básico.

## Sección 8 — Reflexión crítica

**Resiliencia del software.** La decisión de diseño más importante de esta fase fue asumir que la conexión del usuario va a fallar: el adulto mayor ecuatoriano no siempre tiene datos móviles ni WiFi estable. Por eso la resiliencia se implementó en tres capas independientes: (1) el Service Worker precachea la aplicación completa y guarda la última respuesta buena de la API; (2) el hook `useApi` degrada a datos de ejemplo si el servidor no responde, con la app deployada funcionando en "modo demo" sin backend; y (3) el cálculo de dosis disponibles es local y determinista (no depende del servidor), así que la información más crítica para la salud del paciente — "¿qué me toca tomar y cuánto me queda?" — funciona siempre, incluso sin internet. La pirámide de pruebas protege ese comportamiento: las unitarias cubren explícitamente los casos de error de red, y las E2E validan los flujos completos contra un backend real en cada push, de modo que ninguna regresión llega a `main` sin ser detectada.

**Experiencia del usuario final.** Para el público objetivo, cada fricción técnica es una barrera de salud: un login con contraseña que se olvida, un error de conexión que rompe la pantalla, una app que pide actualizarse. Las decisiones de esta fase atacan exactamente eso: autenticación por código SMS en lugar de contraseña, sesión persistente (se abre la app y ya está adentro), actualización silenciosa del Service Worker, mensajes de error en lenguaje claro ("No se pudo conectar con el servidor") y contenido siempre visible gracias al respaldo offline. Lo pendiente para una siguiente iteración: recordatorios de medicina locales con notificaciones push reales, sincronización en cola de pedidos hechos sin conexión, y pruebas de usabilidad con adultos mayores reales midiendo el impacto de estas decisiones.

---

## Anexo — Cómo ejecutar todo

```bash
# Pruebas unitarias con cobertura
cd frontend && npm install && npm run test:coverage

# Pruebas E2E (requiere backend corriendo con seed: ver backend/README.md)
npm run cy:run

# Build de producción PWA
npm run build
```

El pipeline (`.github/workflows/ci.yml`) hace todo esto automáticamente en cada push, y en `main` además despliega a GitHub Pages y corre Lighthouse. **Configuración única requerida**: Settings → Pages → Source: "GitHub Actions".
