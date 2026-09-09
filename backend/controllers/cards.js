const Card = require("../models/card");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

// GET /cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error del servidor",
      });
    });
};

// POST /cards
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Datos de tarjeta no válidos",
        });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Datos de tarjeta no válidos",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error del servidor",
      });
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "No puedes eliminar esta tarjeta" });
      }
      return card.deleteOne().then(() => res.send(card));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Tarjeta no encontrada",
        });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "ID de tarjeta no válido",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error del servidor",
      });
    });
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Tarjeta no encontrada",
        });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "ID de tarjeta no válido",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error del servidor",
      });
    });
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Tarjeta no encontrada",
        });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "ID de tarjeta no válido",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error del servidor",
      });
    });
};
