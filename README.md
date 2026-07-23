# FEMEPASHIDI

Plataforma de la **Federación Mexicana de Patinaje Artistico sobre Hielo y Deportes de Invierno,A.C. (FEMEPASHIDI)** para el registro de patinadores y la inscripción en línea a competencias.

Este repositorio es un **monorepo** que agrupa los tres componentes de la plataforma:

```
femepashidi/
├── api-femepashidi-node/    # Backend (API REST + WebSockets)
├── app-femepashidi-react/   # Panel de gestión (SPA)
└── public/                  # Sitio público estático
```

| Carpeta | Descripción | Stack |
|---|---|---|
| [`api-femepashidi-node/`](./api-femepashidi-node) | API REST: autenticación, registro de patinadores, inscripción a competencias, asociaciones, resultados, cartas, galería, notificaciones en tiempo real. | Node.js, Express, MongoDB, Socket.IO, JWT |
| [`app-femepashidi-react/`](./app-femepashidi-react) | Panel de gestión para administradores, presidentes de asociación y patinadores (inscripciones, resultados, cuentas, cartas de permiso). | React 18, Vite, Bootstrap/Tailwind |
| [`public/`](./public) | Sitio público informativo (landing, galería, avisos). | HTML/CSS/JS plano |

## Requisitos

- Node.js 18+
- Una instancia de MongoDB (Atlas o local)

## Puesta en marcha local

Cada carpeta es un proyecto Node independiente con su propio `package.json` y `.env`.

### 1. API

```bash
cd api-femepashidi-node
npm install
cp .env.example .env   # completar con tus credenciales (Mongo, JWT, correo)
npm run dev             # http://localhost:3000
```

Variables de entorno principales (ver `api-femepashidi-node/config.js`):

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (Railway lo inyecta automáticamente en producción) |
| `MONGO_URI` / `MONGO_DATABASE` | Conexión a MongoDB |
| `JWT_SECRET` | Clave para firmar tokens de sesión |
| `URL_APP` | URL del panel de gestión (para CORS y enlaces en correos) |
| `HOST_EMAIL_SUPPORT`, `EMAIL_SUPPORT`, `PASS_EMAIL_SUPPORT`, `MAIL_FROM` | Envío de correos transaccionales |

### 2. Panel de gestión (app)

```bash
cd app-femepashidi-react
npm install
cp .env.example .env    # VITE_SERVER apuntando a la API local
npm run dev              # http://localhost:5173
```

### 3. Sitio público

```bash
cd public
npx serve .
```

## Despliegue

La plataforma se despliega en [Railway](https://railway.app) como tres servicios independientes, cada uno con su propio *Root Directory* apuntando a `api-femepashidi-node/`, `app-femepashidi-react/` y `public/` respectivamente.

## Licencia

Uso privado — Federación Mexicana de Patinaje Artistico sobre Hielo y Deportes de Invierno,A.C. 2026
