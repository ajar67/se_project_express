const jwt = require("express-jwt");
const { INVALID_AUTHENTICATION } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res, err) => {
  console.error(err);
  res.status(INVALID_AUTHENTICATION).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

const authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("something wrong with authorization");
    console.log(authorization);
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  console.log({token});
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log("wrong with the token");
    console.log(err.name);
    console.log(err.message);
    return handleAuthError(res, err);
  }

  req.user = payload;
  console.log(payload);

  next();
};

module.exports = { authorize };
