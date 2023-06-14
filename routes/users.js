const express = require("express");
const router = express.Router();

const { getUser, getUsers, createUser } = require("../controllers/users");

router.get("/users", getUser);
router.get("/users/:userId", getUsers);
router.post("/users", createUser); // use req.body??

module.exports = router;
