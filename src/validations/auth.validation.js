const Joi = require("joi");

const register = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: true } })
      .required(),
  }),
};

modules.exports = {
    register,
}