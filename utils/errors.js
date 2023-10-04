const INTERNAL_SERVER_ERROR = 500;
const INVALID_DATA_ERROR = 400;
const NO_DATA_WITH_ID_ERROR = 404;
const DUPLICATE_ERROR = 409;
const INVALID_AUTHENTICATION = 401;
const REFUSE_T0_AUTHORIZE_ERROR = 403;

function BadRequestError(message) {
  return {
    name: "BadRequestError",
    message: message || "Bad Request Error",
    statusCode: 400,
  };
}
function UnauthorizedError(message) {
  return {
    name: "UnauthorizedError",
    message: message || "Unauthorized Error",
    statusCode: 401,
  };
}
function ForbiddenError(message) {
  return {
    name: "ForbiddenError",
    message: message || "Forbidden Error",
    statusCode: 403,
  };
}
function NotFoundError(message) {
  return {
    name: "NotFoundError",
    message: message || "Not Found Error",
    statusCode: 404,
  };
}
function ConflictError(message) {
  return {
    name: "ConflictError",
    message: message || "Conflict Error",
    statusCode: 409,
  };
}

module.exports = {
  INTERNAL_SERVER_ERROR,
  INVALID_DATA_ERROR,
  NO_DATA_WITH_ID_ERROR,
  DUPLICATE_ERROR,
  INVALID_AUTHENTICATION,
  REFUSE_T0_AUTHORIZE_ERROR,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
