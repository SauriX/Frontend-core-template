import { translate } from "@/core/localization/translator";
import { ObjectValidationSchema } from "@/app/validators/validatorInterfaces/validationSchema";

export const ExampleFormSchema: ObjectValidationSchema = {
  name: {
    required: true,
    type: "string",
    message: translate("template.form.validation.name", {
      defaultMessage: "El nombre del ejemplo es obligatorio",
    }),
  },
  category: {
    required: true,
    type: "string",
    message: translate("template.form.validation.category", {
      defaultMessage: "La categoría es obligatoria",
    }),
  },
  ownerEmail: {
    required: true,
    type: "string",
    format: "email",
    message: translate("template.form.validation.ownerEmail", {
      defaultMessage: "Debes ingresar un correo válido",
    }),
  },
  description: {
    required: true,
    type: "string",
    message: translate("template.form.validation.description", {
      defaultMessage: "La descripción es obligatoria",
    }),
  },
};
