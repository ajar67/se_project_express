const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");
const {
  INTERNAL_SERVER_ERROR,
  NO_DATA_WITH_ID_ERROR,
} = require("./utils/errors");

const { PORT = 3001 } = process.env;
const server = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
server.use(express.json());

server.use((req, res, next) => {
  req.user = {
    _id: "649077f3e408853941f3b007",
  };
  next();
});

server.use("/users", usersRoutes);
server.use("/items", itemsRoutes);

server.use((req, res) => {
  return res
    .status(NO_DATA_WITH_ID_ERROR)
    .send({ message: "Route" + req.url + " Not found." });
});

server.use((err, req, res) => {
  return res.status(INTERNAL_SERVER_ERROR).send({ error: err });
});

server.listen(PORT, () => {
  console.log("Everything works fine");
});
