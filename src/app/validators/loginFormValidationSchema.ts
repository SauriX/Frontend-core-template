import { ObjectValidationSchema } from "./validatorInterfaces/validationSchema";

// --- Definición de los esquemas anidados, de adentro hacia afuera ---
export const LoginRequestModelSchema: ObjectValidationSchema = {
    username: { required: true, type: "string" },
    password: { required: true, type: "string" },
};

export const OtpRequestModelSchema: ObjectValidationSchema = {
 
    otp: { required: true, type: "string" },
};