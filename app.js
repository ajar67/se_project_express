const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;
const server = express();

server.use("/users", usersRoutes);
server.use("/clothingItems", itemsRoutes);

server.listen(PORT, () => {
  console.log("Everything works fine");
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
