const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Formato de correo electrónico inválido'
    }
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    select: false // ✅ No se devuelve por defecto
  },
  name: {
    type: String,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [30, 'El nombre no puede superar los 30 caracteres'],
    default: 'Jacques Cousteau'
  },
  about: {
    type: String,
    minlength: [2, 'La descripción debe tener al menos 2 caracteres'],
    maxlength: [30, 'La descripción no puede superar los 30 caracteres'],
    default: 'Explorador'
  },
  avatar: {
    type: String,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg'
  }
});

module.exports = mongoose.model('User', userSchema);