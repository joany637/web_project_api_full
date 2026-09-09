const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// ✅ Ruta: Obtener datos del usuario actual
router.get(
  '/me',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  getCurrentUser,
);

router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object({
      avatar: Joi.string().uri().required(),
    }),
  }),
  updateAvatar,
);

module.exports = router;
