const jwt = require("jsonwebtoken");
const { INVALID_AUTHENTICATION } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res, err) => {
  console.error(err);
  res.status(INVALID_AUTHENTICATION).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

const authorize = (req, res, next) => {
  const { authorization } = req.headers;
  console.log({ authorization });
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return handleAuthError(res, err);
  }

  req.user = payload;

  return next();
};

module.exports = { authorize };
