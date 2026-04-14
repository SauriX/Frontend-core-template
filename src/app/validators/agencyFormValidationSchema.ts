import { ObjectValidationSchema } from "./validatorInterfaces/validationSchema";

// --- Definición de los esquemas anidados, de adentro hacia afuera ---
const AgencyRequestModelSchema: ObjectValidationSchema = {
    id: { required: true, type: "number" },
    name: { required: false, type: "string" },
};

const AgencyRequestLevelSchema: ObjectValidationSchema = {
    id: { required: true, type: "number" },
    name: { required: false, type: "string" },
};

const AgencyRequestStatusSchema: ObjectValidationSchema = {
    id: { required: true, type: "number" },
    name: { required: false, type: "string" },
};

const AgencyRequestContactSchema: ObjectValidationSchema = {
  telephone: { required: false, type: "string" }, // Opcional, podría ser un teléfono fijo
  cellPhone: { required: true, type: "string" }, // Celular suele ser un campo clave para contacto
  email: { required: true, type: "string",format: 'email' }, // Email es casi siempre obligatorio
};

const AgencyRequestContactOwnerSchema: ObjectValidationSchema = {
    name: { required: true, type: "string" },
    lastName: { required: true, type: "string" },
    job: { required: true, type: "string" },
    contact: {
    required: true,
    type: "object",
    schema: AgencyRequestContactSchema,
},
idSex: { required: true, type: "number" },
    birthDate: { required: true, type: "string",format: 'date' }, // Puede necesitar validación de formato de fecha aparte
    curp: { required: true, type: "string",format: 'curp' },
};

const AgencyRequestFiscalDataSchema: ObjectValidationSchema = {
    rfc: { required: true, type: "string",format: 'rfc' },
    businessName: { required: true, type: "string" },
    commercialReason: { required: true, type: "string" },
    contactOwner: {
        required: true,
        type: "object",
        schema: AgencyRequestContactOwnerSchema,
    },
};

const AgencyRequestStateSchema: ObjectValidationSchema = {
    id: { required: true, type: "number" },
    name: { required: false, type: "string" },
};

const AgencyRequestCountrySchema: ObjectValidationSchema = {
    id: { required: true, type: "number" },
    iso: { required: false, type: "string" },
};

const AgencyRequestAddressSchema: ObjectValidationSchema = {
    street: { required: true, type: "string" },
    interiorNumber: { required: false, type: "string" }, // Suele ser opcional
    exteriorNumber: { required: true, type: "string" },
    zipCode: { required: true, type: "string" },
    municipality: { required: true, type: "string" },
    settlement: { required: true, type: "string" },
    state: { required: true, type: "object", schema: AgencyRequestStateSchema },
    city: { required: true, type: "string" },
    country: {
        required: true,
        type: "object",
        schema: AgencyRequestCountrySchema,},
};

// El esquema para TaxAddress es idéntico al de Address
const AgencyRequestTaxAddressSchema: ObjectValidationSchema = {
    street: { required: true, type: "string" },
    interiorNumber: { required: false, type: "string" },
    exteriorNumber: { required: true, type: "string" },
    zipCode: { required: true, type: "string" },
    municipality: { required: true, type: "string" },
    settlement: { required: true, type: "string" },
    state: { required: true, type: "object", schema: AgencyRequestStateSchema },
    city: { required: true, type: "string" },
    country: {
        required: true,
        type: "object",
        schema: AgencyRequestCountrySchema,
    },
};

const AgencyRequestDocumentSchema: ObjectValidationSchema = {
    type: { required: true, type: "string" },
    name: { required: true, type: "string" },
    base64: { required: true, type: "string" },
};

// --- El esquema principal para AgencyRequest ---
export const AgencyRequestSchema: ObjectValidationSchema = {
    agencyModel: {
        required: true,
        type: "object",
        schema: AgencyRequestModelSchema,
    },
    agencyLevel: {
        required: true,
        type: "object",
        schema: AgencyRequestLevelSchema,
    },
    status: { required: true, type: "object", schema: AgencyRequestStatusSchema },
    fiscalData: {
        required: true,
        type: "object",
        schema: AgencyRequestFiscalDataSchema,
    },
    address: {
        required: true,
        type: "object",
        schema: AgencyRequestAddressSchema,
    },
    taxAddress: {
        required: true,
        type: "object",
        schema: AgencyRequestTaxAddressSchema,
    },
    documents: {
        required: false,
        type: "array",
        itemSchema: AgencyRequestDocumentSchema,
    }, // El arreglo de documentos suele ser opcional
    idClientUserCreate: { required: false, type: "number" },
};
