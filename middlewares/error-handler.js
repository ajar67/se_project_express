//this is a middlewware totake care of return the status codes
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  if(err instanceof BadRequestError){
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if(err instanceof UnauthorizedError){
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if(err instanceof ForbiddenError){
    statusCode = err.statusCode;
    errorMessage = err. message;
  } else if(err instanceof NotFoundError){
    statusCode = err. statusCode;
    errorMessage = err.message;
  } else if(err instanceof ConflictError){
    statusCode = err.statusCode;
    errorMessage = err.message;
  }

  res.status(statusCode).send({message: errorMessage});
};

module.exports = { errorHandler };
