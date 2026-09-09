# Around API

API Express y cliente React para una aplicación de tarjetas con registro, autenticación JWT, perfiles, likes y control de propietario.

## Ejecución local

1. Instala dependencias en `backend/` y `frontend/` con `npm install`.
2. Copia `backend/.env.example` como `backend/.env` y completa `JWT_SECRET` y `MONGODB_URI`.
3. Asegúrate de tener MongoDB ejecutándose en `mongodb://localhost:27017/web_db`.
4. Inicia la API con `npm run dev` desde `backend/`.
5. Inicia Vite con `npm run dev` desde `frontend/`.

El frontend usa `http://localhost:3000` por defecto. Para otro dominio, define `VITE_API_URL` en `frontend/.env`.

## API

- `POST /signup` y `POST /signin` son públicos.
- `GET /users/me`, `PATCH /users/me` y `PATCH /users/me/avatar` requieren `Authorization: Bearer <token>`.
- Las rutas `/cards` requieren autenticación. Solo el propietario puede eliminar una tarjeta.
- Los logs se escriben en `backend/request.log` y `backend/error.log`.

## Validación

Ejecuta `npm run lint` y `npm run build` dentro de `frontend/`. En `backend/`, ejecuta `npm run lint`.
