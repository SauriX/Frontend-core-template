import { ObjectValidationSchema } from "@/app/validators/validatorInterfaces/validationSchema";

export const ExampleFormPlainSchema: ObjectValidationSchema = {
  name: {
    required: true,
    type: "string",
    message: "Example name is required",
  },
  ownerEmail: {
    required: true,
    type: "string",
    format: "email",
    message: "A valid owner email is required",
  },
};
