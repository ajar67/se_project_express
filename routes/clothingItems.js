const express = require("express");
const { authorize } = require("../middlewares/auth");
const {
  createClothingItemValidation,
  idValidationSchema,
} = require("../middlewares/validation");

const router = express.Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createClothingItemValidation, authorize, createItem);
router.delete("/:itemId", idValidationSchema, authorize, deleteItem);
router.put("/:itemId/likes", idValidationSchema, authorize, likeItem);
router.delete("/:itemId/likes", idValidationSchema, authorize, dislikeItem);

module.exports = router;
