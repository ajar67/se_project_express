const User = require("../models/user");
const validator = require("validator");

const {
  INTERNAL_SERVER_ERROR,
  INVALID_DATA_ERROR,
  NO_DATA_WITH_ID_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((users) => {
      res.status(200).send({ data: users });
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

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
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

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (name.length < 2 || name.length > 30 || !name || !avatar) {
    return res.status(INVALID_DATA_ERROR).send({
      message: "Invalid data!",
    });
  }
  if (!validator.isURL(avatar)) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Error: Invalid url!" });
  }
  User.create({ name, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
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

module.exports = { getUsers, getUser, createUser };
