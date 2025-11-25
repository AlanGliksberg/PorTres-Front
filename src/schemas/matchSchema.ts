import validator from "../utils/customValidator";

export const matchSchema = validator.object({
  clubId: validator.number().nullable().optional(),
  name: validator.string().when("clubId", (clubId, schema) => {
    if (clubId === null || typeof clubId === "undefined") {
      return schema.isRequired();
    }
    return schema;
  }),
  description: validator.string().optional(),
  date: validator.date().isRequired(),
  time: validator.date().isRequired(),
  duration: validator
    .number()
    .isRequired()
    .oneOf([60, 90, 120], "Duración inválida"),
  genderId: validator.number().isRequired(),
  categoryId: validator.number().isRequired(),
  teams: validator.array().optional(),
});
