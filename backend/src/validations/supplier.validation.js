import joi from "joi";

export const supplierValidation = (payload) => {
  const schema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().allow(null).allow(""),
    phone: joi.string().trim().required(),
    email: joi.string().trim().allow(null).allow(""),
    address: joi.string().trim().required(),
  });
  return schema.validate(payload);
};