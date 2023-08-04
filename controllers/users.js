const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("express-jwt");
const {
  INTERNAL_SERVER_ERROR,
  INVALID_DATA_ERROR,
  NO_DATA_WITH_ID_ERROR,
  DUPLICATE_ERROR,
  INVALID_AUTHENTICATION,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("Email already exists!");
        error.statusCode = DUPLICATE_ERROR;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: hash,
      });
    })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log({ name: err.name });
      if (err.name === "ValidationError" || err.name === "ValidatorError") {
        return res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid data!" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occured on the server!" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      res
        .status(INVALID_AUTHENTICATION)
        .send({ message: "Invalid Credentials!" });
    });
};

const getCurrentUser = (req, res) => {
  const currentUser = req.user;
  User.find({ currentUser }).then((result) => {
    res
      .status(200)
      .send({ data: result })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
        console.log(err.name);
        if (err.name === "ValidationError") {
          return res
            .status(INVALID_DATA_ERROR)
            .send({ message: "Invalid data!" });
        }
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error occured on the server!" });
      });
  });
};

const updateProfile = (req, res) => {
  const opts = { runValidators: true };
  User.findOneAndUpdate({ new: true }, opts)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log(err.name);
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
