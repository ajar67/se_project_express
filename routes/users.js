const express = require("express");
const { authorize } = require("../middlewares/auth");

const router = express.Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("users/me", authorize, getCurrentUser);
router.patch("users/me", authorize, updateProfile);

module.exports = router;
