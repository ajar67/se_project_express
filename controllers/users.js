const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  NO_DATA_WITH_ID_ERROR,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

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
      console.error(err);
      if (err.message === "Email already exists!") {
        //return res.status(DUPLICATE_ERROR).send({ message: err.message });
        next(new ConflictError("Email already exists!"));
      }
      if (err.name === "ValidationError") {
        // return res
        //   .status(INVALID_DATA_ERROR)
        //   .send({ message: "Invalid data!" });
        next(new BadRequestError("Invalid data!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.error(err, err.name);
      // res
      //   .status(INVALID_AUTHENTICATION)
      //   .send({ message: "Invalid Credentials!" });
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
      console.error(err);
      if (err.name === "CastError") {
        // return res
        //   .status(INVALID_DATA_ERROR)
        //   .send({ message: "Invalid data!" });
        next(new BadRequestError("Invalid data!"));
      }
      if (err.message === "User ID not found") {
        //return res.status(NO_DATA_WITH_ID_ERROR).send({ message: err.message });
        next(new NotFoundError("User ID not found!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
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
      console.error(err);
      if (err.name === "ValidationError") {
        // return res
        //   .status(INVALID_DATA_ERROR)
        //   .send({ message: "Invalid data!" });
        next(new BadRequestError("Invalid data!"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occured on the server!" });
      next();
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
