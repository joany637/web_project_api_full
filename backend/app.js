const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, Segments, errors } = require("celebrate");
const validator = require("validator");
const cardsRouter = require("./routes/cards"); // Quita comentario si tienes tarjetas

// require('dotenv').config();

const { createUser, login } = require("./controllers/users");
const usersRouter = require("./routes/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
// ✅ Función de validación de URL
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/web_db")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.log("❌ Error de conexión:", err));

// ✅ CORS habilitado
app.use(cors());
// Parsear JSON
app.use(express.json());

// 📝 Registro de solicitudes
app.use(requestLogger);

// 🧪 Ruta de prueba de caída — ELIMÍNALA DESPUÉS DE LA REVISIÓN
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

// ======================================
// ✅ RUTAS PÚBLICAS — SIN TOKEN
// ======================================

// Inicio de sesión con validación
app.post(
  "/signin",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

// Registro con validación
app.post(
  "/signup",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
    }),
  }),
  createUser,
);

// ======================================
// 🔒 PROTEGER TODAS LAS RUTAS SIGUIENTES
// ======================================
app.use(auth);

// ======================================
// ✅ RUTAS PROTEGIDAS — CON TOKEN
// ======================================
app.use("/users", usersRouter);
app.use("/cards", cardsRouter); // Quita comentario si tienes tarjetas

// ======================================
// ⚠️ Manejo de errores
// ======================================
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
