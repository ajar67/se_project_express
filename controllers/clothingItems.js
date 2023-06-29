const clothingItem = require("../models/clothingItem");
const validator = require("validator");

const {
  INTERNAL_SERVER_ERROR,
  INVALID_DATA_ERROR,
  NO_DATA_WITH_ID_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Id!" });
      }
      if (err.name === "Error") {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  if (name.length < 2 || name.length > 30 || !weather) {
    return res.status(INVALID_DATA_ERROR).send({
      message: "Invalid data!",
    });
  }

  if (!validator.isURL(imageUrl)) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Error: Invalid url!" });
  }

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Id!" });
      }
      if (err.name === "Error") {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndRemove(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Id!" });
      }
      if (err.name === "Error") {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

const likeItem = (req, res) => {
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
      console.log(err);
      console.log(err.message);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Id!" });
      }
      if (err.name === "Error") {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

const dislikeItem = (req, res) => {
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
      console.log(err);
      console.log(err.message);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Id!" });
      }
      if (err.name === "Error") {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
