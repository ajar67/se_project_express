const express = require("express");
const { authorize } = require("../middlewares/auth");
const {
  createUserValidation
} = require("../middlewares/validation");

const router = express.Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", authorize, getCurrentUser);
router.patch("/me", createUserValidation, authorize, updateProfile);

module.exports = router;
