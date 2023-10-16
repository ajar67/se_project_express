const clothingItem = require("../models/clothingItem");

const {
  NO_DATA_WITH_ID_ERROR,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => next(err));
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid ID!"));
      }
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new Error("Access to this resource is forbidden.");
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item was deleted!" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        next(new NotFoundError("Id is not found in the database!"));
      }
      if (err.message === "Access to this resource is forbidden.") {
        next(new ForbiddenError("Access to this resource is forbidden."));
      }

      next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        next(new NotFoundError("Id is not found in the database!"));
      }

      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        next(new NotFoundError("Id is not found in the database!"));
      }

      next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
