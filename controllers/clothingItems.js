const clothingItem = require("../models/clothingItem");

const {
  NO_DATA_WITH_ID_ERROR,
  REFUSE_T0_AUTHORIZE_ERROR,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch(() =>
      //   res
      //     .status(INTERNAL_SERVER_ERROR)
      //     .send({ message: "An error occured on the server!" })
      next()
    );
};

const createItem = (req, res, next) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  console.log({ name, weather, imageUrl });

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        //return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.name === "ValidationError") {
        // return res
        //   .status(INVALID_DATA_ERROR)
        //   .send({ message: "Invalid data!" });
        next(new BadRequestError("Invalid ID!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
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
        return res
          .status(REFUSE_T0_AUTHORIZE_ERROR)
          .send({ message: "Access to this resource is forbidden." });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item was deleted!" }));
    })
    .catch((err) => {
      console.error("deleteItem: ", err, err.name);
      if (err.name === "CastError") {
        //return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        // return res
        //   .status(NO_DATA_WITH_ID_ERROR)
        //   .send({ message: "Id is not in database!" });
        next(new NotFoundError("Id is not found in the database!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
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
      console.error("likeItem: ", err, err.name);
      if (err.name === "CastError") {
        //return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        // return res
        //   .status(NO_DATA_WITH_ID_ERROR)
        //   .send({ message: "Id is not in database!" });
        next(new NotFoundError("Id is not found in the database!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  console.log("item id: ", itemId);
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
      console.log("item likes ", item.likes);
      console.log("item: ", item);
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error("dislikeItem: ", err, err.name);
      if (err.name === "CastError") {
        //return res.status(INVALID_DATA_ERROR).send({ message: "Invalid Id!" });
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.statusCode === NO_DATA_WITH_ID_ERROR) {
        // return res
        //   .status(NO_DATA_WITH_ID_ERROR)
        //   .send({ message: "Id is not in database!" });
        next(new NotFoundError("Id is not found in the database!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
