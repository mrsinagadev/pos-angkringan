import joi from "joi";

export const purchaseValidation = (payload) => {
  const schema = joi.object({
    date: joi.date().required(),
    note: joi.string().trim().required(),
    userId: joi.number().required(),
    total: joi.number().required(),
    ppn: joi.number().required(),
    grandTotal: joi.number().required(),
    detail: joi.array().required(),
  });
  return schema.validate(payload);
};