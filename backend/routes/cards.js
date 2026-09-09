const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);

router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard,
);

router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", likeCard);

router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
