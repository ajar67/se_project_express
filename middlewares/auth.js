const jwt = require('express-jwt');
const { INVALID_AUTHENTICATION } = require("../utils/errors");
const {JWT_SECRET} = require('../utils/config');

const handleAuthError = () => {
  res.status(INVALID_AUTHENTICATION).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

const authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};

module.exports = {authorize};
