const User = require("../models/user");

const {
  INTERNAL_SERVER_ERROR,
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
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Requested resource not found" });
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
      res.send({ data: user });
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Requested resource not found" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Requested resource not found" });
    });
};

module.exports = { getUsers, getUser, createUser };
