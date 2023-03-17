const Joi = require('joi');

const schema = Joi.when(Joi.ref("$requestMethod"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        name: Joi.string()
          .min(3)
          .max(30)
          .required()
          .allow(''),

        email: Joi.string()
          .min(6)
          .max(30)
          .email()
          .required()
          .allow(''),

        phone: Joi.string()
          .length(13)
          .pattern(/^\+380\d{9}$/)
          .required()
          .allow(''),
      }),
    },
    {
      is: "PUT",
      then: Joi.object({
        name: Joi.string()
          .min(3)
          .max(30)
          .allow(''),

        email: Joi.string()
          .min(6)
          .max(30)
          .email()
          .allow(''),

        phone: Joi.string()
          .length(13)
          .pattern(/^\+380\d{9}$/)
          .allow(''),
      }),
    },
  ],
});

module.exports = {
  schema
}