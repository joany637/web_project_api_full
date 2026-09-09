const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

// ✅ Registro de usuario
const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then(user => {
      const userData = user.toObject();
      delete userData.password; // No devolver contraseña
      res.status(201).send(userData);
    })
    .catch(err => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'El correo electrónico ya está registrado' });
      }
      res.status(500).send({ message: 'Se ha producido un error en el servidor' });
    });
};

// ✅ Inicio de sesión
const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // ✅ Incluir contraseña para comparar
    .then(user => {
      if (!user) {
        return res.status(401).send({ message: 'Correo o contraseña incorrectos' });
      }
      return bcrypt.compare(password, user.password)
        .then(match => {
          if (!match) {
            return res.status(401).send({ message: 'Correo o contraseña incorrectos' });
          }
          // Crear token que expira en 7 días
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'clave_secreta_desarrollo_123',
            { expiresIn: '7d' }
          );
          return res.send({ token });
        });
    })
    .catch(() => res.status(500).send({ message: 'Se ha producido un error en el servidor' }));
};

// ✅ Obtener datos del usuario actual
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Se ha producido un error en el servidor' }));
};

module.exports = { createUser, login, getCurrentUser };