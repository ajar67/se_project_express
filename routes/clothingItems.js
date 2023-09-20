const express = require("express");
const { authorize } = require("../middlewares/auth");

const router = express.Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", authorize, createItem);
router.delete("/:itemId", authorize, deleteItem);
router.put("/:itemId/likes", authorize, likeItem);
router.delete("/:itemId/likes", authorize, dislikeItem);

module.exports = router;
