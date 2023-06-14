const clothingItem = require("../models/clothingItem");

const getItems = (res) => {
  clothingItem
    .find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch(() => {
      res.status(500).send({ message: "Requested resource not found" });
    });
};

const createItem = (req, res) => {
  const { name, weather, image } = req.body;
  clothingItem
    .create({ name, weather, image })
    .then((item) => {
      res.send({ data: item });
    })
    .catch(() => {
      res.status(500).send({ message: "Requested resource not found" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .deleteOne(itemId)
    .then((item) => {
      res.send({ data: item });
    })
    .catch(() => {
      res.status(500).send({ message: "Requested resource not found" });
    });
};

module.exports = { getItems, createItem, deleteItem };
