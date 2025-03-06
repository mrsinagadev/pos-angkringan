import joi from "joi";

export const categoryValidation = (payload) => {
  const schema = joi.object({
    kategoryName: joi.string().trim().required(),
  });
  return schema.validate(payload);
};