const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");
const errorHandler = require("./middlewares/error-handler");
const {
  INTERNAL_SERVER_ERROR,
  NO_DATA_WITH_ID_ERROR,
} = require("./utils/errors");

const { login, createUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const server = express();
server.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
server.use(express.json());
server.use(cors());

server.use("/users", usersRoutes);
server.use("/items", itemsRoutes);

server.post("/signin", login);
server.post("/signup", createUser);

server.use((req, res) => {
  res
    .status(NO_DATA_WITH_ID_ERROR)
    .send({ message: `Route ${req.url} not found!` });
});

server.use((err, req, res) => {
  res.status(INTERNAL_SERVER_ERROR).send({ message: err });
});

server.use(errorHandler);

server.listen(PORT, () => {});
