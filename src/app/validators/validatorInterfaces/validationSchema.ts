// --- Interfaces para el esquema de validación  ---
// Interfaces para el esquema de validación
export interface PropertyValidationRule {
    required?: boolean;
    message?: string;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array'; // Añadido 'array'
    schema?: ObjectValidationSchema;
    itemSchema?: ObjectValidationSchema; // Nuevo: esquema para elementos de un array
    format?: 'curp' | 'rfc' | 'email' | 'date'| 'mobile';
}
export interface ObjectValidationSchema {
    [propertyName: string]: PropertyValidationRule;
}