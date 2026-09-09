const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { getCurrentUser } = require('../controllers/users');

// ✅ Ruta: Obtener datos del usuario actual
router.get('/me', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), getCurrentUser);

module.exports = router;