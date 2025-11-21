import validator from "../utils/customValidator";

export const registerSchema = validator
  .object({
    firstName: validator.string().isRequired().maxStr(40),
    lastName: validator.string().isRequired().maxStr(40),
    email: validator.string().email("Email inválido").isRequired().maxStr(50),
    phone: validator.string().optional().maxStr(20),
    password: validator
      .string()
      .isRequired()
      .minStr(8)
      .maxStr(40)
      .passwordValid(),
    confirmPassword: validator
      .string()
      .oneOf([validator.ref("password")], "Las contraseñas no coinciden")
      .isRequired(),
  })
  .defined();
