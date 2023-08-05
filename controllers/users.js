const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  INTERNAL_SERVER_ERROR,
  INVALID_DATA_ERROR,
  NO_DATA_WITH_ID_ERROR,
  DUPLICATE_ERROR,
  INVALID_AUTHENTICATION,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        throw new Error("Validation Error");
      }
      if (user) {
        throw new Error("Email already exists!");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: hash,
      });
    })
    .then((user) => {
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
      console.log({ user });
      console.log(user.password);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log({ name: err.name });
      if (err.message === "Email already exists!") {
        return res.status(DUPLICATE_ERROR).send({ message: err.message });
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

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(INVALID_AUTHENTICATION)
        .send({ message: "Invalid Credentials!" });
    });
};

const getCurrentUser = (req, res) => {
  const currentUser = req.user;
  User.find({ currentUser })
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((result) => {
      return res
        .status(200)
        .send({ data: result })
        .catch((err) => {
          console.log(err);
          console.log(err.message);
          console.log(err.name);
          if (err.name === "CastError") {
            return res
              .status(INVALID_DATA_ERROR)
              .send({ message: "Invalid data!" });
          }
          if (err.message === "User ID not found") {
            return res
              .status(NO_DATA_WITH_ID_ERROR)
              .send({ message: err.message });
          }
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error occured on the server!" });
        });
    });
};

const updateProfile = (req, res) => {
  const opts = { runValidators: true };
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.user.name, avatar: req.user.avatar },
    { new: true, opts }
  )
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
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
