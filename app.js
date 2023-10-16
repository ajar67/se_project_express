const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");
const { errorHandler } = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/errors");
const {
  createUserValidation,
  createLoginAuthenticationValidation,
} = require("./middlewares/validation");

const { login, createUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const server = express();
server.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
server.use(express.json());
server.use(cors());
server.use(requestLogger);

server.use("/users", usersRoutes);
server.use("/items", itemsRoutes);
server.post("/signin", createLoginAuthenticationValidation, login);
server.post("/signup", createUserValidation, createUser);

server.use(errorLogger);

server.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

server.use((req, next) => {
  next(new NotFoundError(`Route ${req.url} not found!`));
});

server.use(errors());
server.use(errorHandler);

server.listen(PORT, () => {});
