import { translate } from "@/core/localization/translator";
import { ObjectValidationSchema } from "../validatorInterfaces/validationSchema";

export const ExampleUserSchema: ObjectValidationSchema = {
  firstName: {
    required: true,
    type: "string",
    message: translate("validation.user.firstName", {
      defaultMessage: "El nombre es obligatorio",
    }),
  },
  email: {
    required: true,
    type: "string",
    format: "email",
    message: translate("validation.user.email", {
      defaultMessage: "El correo es obligatorio",
    }),
  },
};
