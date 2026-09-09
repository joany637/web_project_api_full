const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'clave_secreta_desarrollo_123';

// ✅ Registro de usuario
const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password; // No devolver contraseña
      return res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: 'El correo electrónico ya está registrado' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Datos de usuario no válidos' });
      }
      return res
        .status(500)
        .send({ message: 'Se ha producido un error en el servidor' });
    });
};

// ✅ Inicio de sesión
const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password') // ✅ Incluir contraseña para comparar
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: 'Correo o contraseña incorrectos' });
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res
            .status(401)
            .send({ message: 'Correo o contraseña incorrectos' });
        }
        // Crear token que expira en 7 días
        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: '7d',
        });
        return res.send({ token });
      });
    })
    .catch(() => res
      .status(500)
      .send({ message: 'Se ha producido un error en el servidor' }));
};

// ✅ Obtener datos del usuario actual
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      return res.send(user);
    })
    .catch(() => res
      .status(500)
      .send({ message: 'Se ha producido un error en el servidor' }));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Datos de usuario no válidos' });
      }
      return res
        .status(500)
        .send({ message: 'Se ha producido un error en el servidor' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Datos de avatar no válidos' });
      }
      return res
        .status(500)
        .send({ message: 'Se ha producido un error en el servidor' });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
