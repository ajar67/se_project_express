const clothingItem = require("../models/clothingItem");

const {
  INTERNAL_SERVER_ERROR,
  INVALID_DATA_ERROR,
  NO_DATA_WITH_ID_ERROR,
  REFUSE_T0_AUTHORIZE_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch(() => res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" }));
};

const createItem = (req, res) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  console.log({name, weather, imageUrl});

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error('createItem: ', err);
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid data!" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

const deleteItem = (req, res) => {
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
        return res
          .status(REFUSE_T0_AUTHORIZE_ERROR)
          .send({ message: "Access to this resource is forbidden." });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item was deleted!" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      return res
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
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      return res
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
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        return res
          .status(NO_DATA_WITH_ID_ERROR)
          .send({ message: "Id is not in database!" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
