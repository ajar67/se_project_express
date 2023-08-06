const jwt = require("jsonwebtoken");
const { INVALID_AUTHENTICATION } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res) => res
    .status(INVALID_AUTHENTICATION)
    .send({ message: "Authorization Error" });

const extractBearerToken = (header) => header.replace("Bearer ", "");

const authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
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

  return next();
};

module.exports = { authorize };
