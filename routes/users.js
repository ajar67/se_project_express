const express = require("express");
const { authorize } = require("../middlewares/auth");

const router = express.Router();

const {
  getUser,
  getUsers,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

// router.get("/:userId", getUser);
// router.get("/", getUsers);
// router.post("/", createUser);

router.get("/me", authorize, getCurrentUser);
router.patch("/me", authorize, updateProfile);

module.exports = router;
