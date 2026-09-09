const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { celebrate, Joi, Segments, errors } = require("celebrate");
const validator = require("validator");
const cors = require("cors");

const cardsRouter = require("./routes/cards"); // Quita comentario si tienes tarjetas

// require('dotenv').config();

const { createUser, login } = require("./controllers/users");
const usersRouter = require("./routes/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const allowedCors = [
  "https://around.allisons.org",
  "https://www.around.allisons.org",
  "http://localhost:5173",
  "http://localhost:3000",
];
// ✅ Función de validación de URL
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  next();
});
// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/web_db")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.log("❌ Error de conexión:", err));

// ✅ CORS habilitado
app.use(
  cors({
    origin: allowedCors,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Parsear JSON
app.use(express.json());

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
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
