const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const {
  NO_DATA_WITH_ID_ERROR,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const createUser = (req, res, next) => {
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
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      if (err.message === "Email already exists!") {
        next(new ConflictError("Email already exists!"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data!"));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "7d" }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("Invalid Credentials!"));
    });
};

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NO_DATA_WITH_ID_ERROR;
      throw error;
    })
    .then((result) => res.status(200).send({ data: result }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data!"));
      }
      if (err.message === "User ID not found") {
        next(new NotFoundError("User ID not found!"));
      }

      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const opts = { new: true, runValidators: true };
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, avatar: req.body.avatar },
    opts
  )
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data!"));
      }

      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
