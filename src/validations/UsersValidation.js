const Joi = require("joi");

const loginUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

module.exports = loginUserValidation;
