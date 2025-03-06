import joi from "joi";

export const userValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().required(),
    userName: joi.string().min(4).trim().required(),
    password: joi.string().min(4).max(15).required(),
    confirmPassword: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "{{#label}} not same as password",
        "any.required": "{{#label}} is required",
      }),
    role: joi.string().trim().required(),
  });
  return schema.validate(payload);
};

export const userUpdateValidation = (payload) => {
  const schema = joi.object({
    userName: joi.string().min(4).trim().required(),
    password: joi.string().allow(null).allow(""),
    confirmPassword: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "{{#label}} not same as password",
        "any.required": "{{#label}} is required",
      }),
    name: joi.string().trim().required(),
    role: joi.string().trim().required(),
  });
  return schema.validate(payload);
};