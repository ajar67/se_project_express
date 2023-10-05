// middleware/validation.js

const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const createClothingItemValidation = celebrate({
  [Segments.BODY]: Joi.object({
    itemName: Joi.string().min(2).max(30).required().messages({
      "string.min": "The minimum length of 'name' field is 2",
      "string.max": "The maximum lenght of 'name field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    imageUrl: Joi.string().custom(validateURL).required().message({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
  }),
});

const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    userName: Joi.string().min(2).max(30).required().messages({
      "string.min": "The minimum length of 'name' field is 2",
      "string.max": "The maximum lenght of 'name field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    userAvatar: Joi.string().custom(validateURL).required().message({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    email: Joi.string().email().required().message({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().message({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

const createLoginAuthenticationValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required().message({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().message({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

const idValidationSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().length(24).hex().required().message({
      "string.empty": "The 'id' field must be filled in",
      "string.length": "The 'id' field must have a length of 24",
    }),
  }),
});

module.exports = {
  createClothingItemValidation,
  createUserValidation,
  createLoginAuthenticationValidation,
  idValidationSchema,
};
