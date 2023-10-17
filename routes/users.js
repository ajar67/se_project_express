const express = require("express");
const { authorize } = require("../middlewares/auth");
const { updateUserValidation } = require("../middlewares/validation");

const router = express.Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", authorize, getCurrentUser);
router.patch("/me", authorize, updateUserValidation, updateProfile);

module.exports = router;
