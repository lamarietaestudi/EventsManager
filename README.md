# EventsManager

## Descripción del Proyecto

EventsManager es una aplicación web diseñada para la gestión y visualización de eventos relacionados con el sector de la tecnología. Permite a los usuarios explorar eventos, ver detalles como la ubicación, descripción y los asistentes. Los usuarios también pueden publicar sus propios eventos

Este proyecto se divide en dos partes principales:

- **Backend:** Una API RESTful construida con Node.js, Express y MongoDB, desplegada en Render. El backend se encarga de la gestión de los datos de los eventos, usuarios y la lógica de la aplicación. También utiliza Cloudinary para la gestión de imágenes de los pósters de los eventos.
- **Frontend:** Una interfaz de usuario construida con Vite (Vanilla JavaScript), desplegada en Vercel. El frontend consume la API del backend para mostrar la información de los eventos a los usuarios.

## Tecnologías Utilizadas

**Backend:**

- Node.js
- Express
- MongoDB
- Mongoose (para interactuar con MongoDB)
- dotenv (para la gestión de variables de entorno)
- cors (para habilitar el acceso cruzado entre dominios)
- Cloudinary (para almacenamiento de imágenes)

**Frontend:**

- Vite
- JavaScript (ES6+)
- HTML
- CSS

## Despliegue

- **Backend:** Desplegado en [Render](https://render.com/). La API está disponible en [https://eventsmanager-aldw.onrender.com/](https://eventsmanager-aldw.onrender.com/).
- **Frontend:** Desplegado en [Vercel](https://vercel.com/). La aplicación web está disponible en [https://events-manager-nine.vercel.app/](https://events-manager-nine.vercel.app/).

## 📚 Endpoints de la API

### 🔐 Autenticación

| Método | Ruta                           | Descripción                                            | Auth |
| ------ | ------------------------------ | ------------------------------------------------------ | ---- |
| POST   | `/users/auth`                  | Registrar o iniciar sesión (login/register)            | ❌   |
| GET    | `/users/confirmations/:userId` | Obtener las confirmaciones de asistencia a los eventos | ✅   |

### 👤 Usuarios

| Método | Ruta                                         | Descripción                           | Auth |
| ------ | -------------------------------------------- | ------------------------------------- | ---- |
| GET    | `/users`                                     | Listar todos los usuarios             | ❌   |
| GET    | `/users/:id`                                 | Obtener un usuario por su ID          | ❌   |
| PUT    | `/users/:id`                                 | Actualizar perfil de usuario (propio) | ✅   |
| DELETE | `/users/:id`                                 | Eliminar cuenta de usuario (propia)   | ✅   |
| PUT    | `/users/:userId/favorites/:eventId`          | Añadir evento a favoritos             | ✅   |
| DELETE | `/users/:userId/favorites/:eventId`          | Quitar evento de favoritos            | ✅   |
| PUT    | `/users/confirm-assistance/:userId/:eventId` | Confirmar asistencia a evento         | ✅   |
| DELETE | `/users/cancel-assistance/:userId/:eventId`  | Cancelar asistencia a evento          | ✅   |

### 📅 Eventos

| Método | Ruta                        | Descripción                                   | Auth |
| ------ | --------------------------- | --------------------------------------------- | ---- |
| GET    | `/events`                   | Obtener todos los eventos                     | ❌   |
| GET    | `/events/:id`               | Obtener detalles de un evento específico      | ❌   |
| GET    | `/events/me/events`         | Obtener los eventos publicados por un usuario | ✅   |
| GET    | `/events/visitors/:eventId` | Obtener lista de asistentes de un evento      | ✅   |
| POST   | `/events`                   | Crear un nuevo evento                         | ✅   |
| PUT    | `/events/:id`               | Editar un evento publicado por el usuario     | ✅   |
| DELETE | `/events/:id`               | Eliminar un evento ublicado por el usuario    | ✅   |

## Aviso Legal

### Proyecto Práctico

Este proyecto es una práctica personal y no representa un producto comercial. Está destinado a la demostración de habilidades técnicas y el aprendizaje.
