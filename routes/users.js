const express = require("express");

const router = express.Router();

const { getUser, getUsers, createUser } = require("../controllers/users");

router.get("/:userId", getUser);
router.get("/", getUsers);
router.post("/", createUser); // use req.body??

module.exports = router;
