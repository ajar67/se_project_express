const User = require("../models/user");

const getUsers = (res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: "Requested resource not found" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(500).send({ message: "Requested resource not found" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(500).send({ message: "Requested resource not found" });
    });
};

module.exports = { getUsers, getUser, createUser };
