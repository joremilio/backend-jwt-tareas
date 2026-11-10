# Backend de Tareas con autenticación JWT

API REST hecha con **Node.js + Express + MongoDB (Mongoose)**. Permite registrar usuarios, iniciar sesión obteniendo un **token JWT** y administrar un CRUD de tareas protegido con **Bearer Token**, donde cada usuario solo puede ver, modificar y eliminar **sus propias tareas**.

Autor: Jorge — Ingeniería de Software, Universidad Anáhuac Mayab.

## Tecnologías

- Node.js y Express 5
- MongoDB Atlas con Mongoose
- jsonwebtoken (JWT)
- bcrypt para cifrar contraseñas
- dotenv, express-async-handler, nodemon

## Estructura

```
backend/
├── config/db.js                  # conexión a MongoDB
├── controllers/
│   ├── usersControllers.js       # crearUser, loginUser, datosUser
│   └── tareasControllers.js      # getTareas, createTareas, updateTareas, deleteTareas
├── middleware/
│   ├── authMiddleware.js         # protect: valida el Bearer token
│   └── errorMiddleware.js        # respuestas de error en JSON
├── models/
│   ├── usersModel.js
│   └── tareasModel.js            # cada tarea guarda el id de su dueño (user)
├── routes/
│   ├── usersRoutes.js            # /api/users
│   └── tareasRoutes.js           # /api/tareas
└── server.js
```

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/TU_USUARIO/backend-jwt-tareas.git
   cd backend-jwt-tareas
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Crea un archivo `.env` en la raíz copiando `.env.example` y llena tus valores:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_DB=tu_cadena_de_conexion_de_mongodb
   JWT_SECRET=un_secreto_largo_y_aleatorio
   ```

## Ejecución

```
npm run server   # desarrollo, con nodemon
npm start        # modo normal
```

El servidor queda en `http://localhost:5000`.

## Endpoints

| Método | Ruta | Controlador | Descripción | ¿Token? |
|--------|------|-------------|-------------|---------|
| POST | /api/users | crearUser | Registrar usuario | No |
| POST | /api/users/login | loginUser | Iniciar sesión y obtener el JWT | No |
| GET | /api/users/datos | datosUser | Datos del usuario dueño del token | Sí |
| GET | /api/tareas | getTareas | Listar solo las tareas del usuario logueado | Sí |
| POST | /api/tareas | createTareas | Crear una tarea asignada al usuario logueado | Sí |
| PUT | /api/tareas/:id | updateTareas | Modificar una tarea propia | Sí |
| DELETE | /api/tareas/:id | deleteTareas | Eliminar una tarea propia | Sí |

Las rutas protegidas necesitan el header:

```
Authorization: Bearer <token>
```

### Ejemplos de body

Registro:
```json
{ "name": "Pedro", "email": "pedro@test.com", "password": "123456" }
```

Login:
```json
{ "email": "pedro@test.com", "password": "123456" }
```

Crear o modificar tarea:
```json
{ "descripcion": "Mi tarea" }
```

## Seguridad

- Las contraseñas se guardan cifradas con bcrypt.
- El middleware `protect` valida el token en todas las rutas de tareas y en `/api/users/datos`; sin token o con token inválido responde **401 Unauthorized**.
- El id del usuario se obtiene del token (`req.user.id`), nunca del body ni de la URL.
- Cada tarea guarda el id de su dueño y **todas** las consultas filtran por ese id. Si un usuario intenta modificar o eliminar una tarea ajena, la API responde **404** y la tarea no cambia.
