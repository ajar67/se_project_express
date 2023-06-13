const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const server = express();

server.listen(PORT, () => {
  console.log("Everything works fine");
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
