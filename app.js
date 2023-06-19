const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;
const server = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
server.use(express.json());

server.use("/users", usersRoutes);
server.use("/items", itemsRoutes);

server.use((req, res, next) => {
  req.user = {
    _id: "649077f3e408853941f3b007",
  };
  next();
});

server.listen(PORT, () => {
  console.log("Everything works fine");
});
