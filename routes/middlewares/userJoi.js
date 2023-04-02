const Joi = require("joi");

const UserSchema = Joi.when(Joi.ref("$requestMethod"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        email: Joi.string().min(6).max(30).email().required().allow(""),

        password: Joi.string().max(13),

        subscription: Joi.string().empty(""),
      }),
    },
  ],
});

module.exports = {
  UserSchema,
};
