import { CustomError } from "../models/errors";
import { ObjectValidationSchema } from "../validators/validatorInterfaces/validationSchema";
import i18n from "@/i18n"; // Importar i18n
import moment from "moment";
const { t } = i18n.global; // Acceso directo a la función t

// Tu función isNullOrEmpty (ajustada para ser más general si es necesario)
export function isNullOrEmpty(value: any): boolean {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string') {
        return value.trim() === '';
    }
    if (typeof value === 'number') {
        // Tu lógica original: `!value` considera 0, NaN como "vacío".
        return !value;
    }
    // Para arrays, se considera "vacío" si su longitud es 0
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    // Para objetos, se considera "vacío" si no tiene propiedades enumerables propias
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return false; // Otros tipos (boolean, function, etc.) no se consideran "vacíos" aquí.
}
/**
 * Valida el formato de una CURP mexicana.
 * @param value La cadena a validar.
 * @param key La clave de la propiedad para el error.
 * @returns CustomError si el formato es inválido, de lo contrario null.
 */
export function validateCurp(value: string, key: string): CustomError | null {
    if (!value) {
        // Si está vacío, se asume que la validación de "required" lo manejará.
        // Esta función solo se enfoca en el formato si el valor existe.
        return null; 
    }
        // Regex para CURP:
    // ^[A-Z]{4} -> 4 letras (primer apellido, segundo apellido, nombre)
    // \d{6}    -> 6 dígitos (fecha de nacimiento YYMMDD)
    // [HM]     -> Sexo (H o M)
    // [A-Z]{2} -> 2 letras (estado de nacimiento)
    // [BCDFGHJKLMNPQRSTVWXYZ]{3} -> 3 consonantes (primer apellido, segundo apellido, nombre) - Homoclave
    // [0-9A-Z]\d$ -> 1 dígito/letra (diferenciador de homoclave) y 1 dígito (dígito verificador)
    const curpRegex = /^[A-Z]{4}\d{6}[HM](?:AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NE|NL|OC|PL|QT|QR|SL|SP|SR|TC|TL|TS|VZ|YN|ZS)[A-Z]{3}[0-9A-Z]\d$/i;
     if (!curpRegex.test(value)) {
        return new CustomError(key, t('validation.curp.invalid', { value }));
    }
    return null;
}

/**
 * Valida el formato de un RFC mexicano (Persona Física o Persona Moral).
 * @param value La cadena a validar.
 * @param key La clave de la propiedad para el error.
 * @returns CustomError si el formato es inválido, de lo contrario null.
 */

export function validateRfc(value: string, key: string): CustomError | null {
    if (!value) {
        return null;
    }

    // Regex para RFC:
    // ^[A-Z&Ñ]{3,4} -> 3 o 4 letras (para Persona Moral o Física)
    // \d{6}        -> 6 dígitos (fecha de nacimiento/constitución YYMMDD)
    // [A-Z0-9]{3}$ -> 3 caracteres alfanuméricos (homoclave)

    // Regex más general, solo para la estructura básica
    const rfcRegex = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/i;
    
    if (!rfcRegex.test(value)) {
        return new CustomError(key, t('validation.rfc.invalid', { value }));
    }
    return null;
}
/**
 * Valida el formato de una dirección de correo electrónico.
 * @param value La cadena a validar.
 * @param key La clave de la propiedad para el error.
 * @returns CustomError si el formato es inválido, de lo contrario null.
 */
export function validateEmail(value: string, key: string): CustomError | null {
    if (!value) {
        return null;
    }

    // Regex estándar para la validación de email (puede ser más o menos estricta dependiendo de las necesidades)
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!emailRegex.test(value)) {
        return new CustomError(key, t('validation.email.invalid', { value }));
    }
    return null;
}

/**
 * Valida celular a 10 digitos
 * @param value La cadena a validar.
 * @param key La clave de la propiedad para el error.
 * @returns CustomError si el formato es inválido, de lo contrario null.
 */
export function validateMobile(value: string, key: string): CustomError | null {
    if (!value) {
        return null;
    }

    // Regex estándar para la validación de email (puede ser más o menos estricta dependiendo de las necesidades)
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!phoneRegex.test(value)) {
        return new CustomError(key, t('validation.mobile.invalid', { value }));
    }
    return null;
}

// --- Función de validación principal ---
export function validateObjectProperties(
    obj: any,
    schema: ObjectValidationSchema,
    parentKey: string = ''
): CustomError[] {
    const errors: CustomError[] = [];

    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        return errors;
    }

    for (const propName in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, propName)) {
            const rule = schema[propName];
            const value = obj[propName];
            const currentKey = parentKey ? `${parentKey}.${propName}` : propName;

            // Validar campo requerido
            if (rule.required && isNullOrEmpty(value)) {
                errors.push(new CustomError(
                    currentKey, 
                    rule.message || t('validation.required')
                ));
                continue;
            }

            // Validar tipo si existe el valor
            if (value !== undefined && value !== null) { 
                if (rule.type) {
                    switch (rule.type) {
                        case 'string':
                            if (typeof value !== 'string') {
                                errors.push(new CustomError(
                                    currentKey, 
                                    rule.message || t('validation.string')
                                ));
                            } else if (rule.format) {
                                let formatError: CustomError | null = null;
                                switch (rule.format) {
                                    case 'curp':
                                        formatError = validateCurp(value, currentKey);
                                        break;
                                    case 'rfc':
                                        formatError = validateRfc(value, currentKey);
                                        break;
                                    case 'email':
                                        formatError = validateEmail(value, currentKey);
                                        break;
                                    case 'date':
                                        if (isNaN(Date.parse(value))) {
                                            formatError = new CustomError(
                                                currentKey, 
                                                rule.message || t('validation.date')
                                            );
                                        }
                                        break;
                                    case 'mobile':
                                        formatError = validateMobile(value, currentKey);
                                        break;
                                }
                                if (formatError) {
                                    errors.push(formatError);
                                }
                            }
                            break;
                        case 'number':
                            if (typeof value !== 'number' || isNaN(value)) {
                                errors.push(new CustomError(
                                    currentKey, 
                                    rule.message || t('validation.number')
                                ));
                            }
                            break;
                        case 'boolean':
                            if (typeof value !== 'boolean') {
                                errors.push(new CustomError(
                                    currentKey, 
                                    rule.message || t('validation.boolean')
                                ));
                            }
                            break;
                        case 'object':
                            if (typeof value !== 'object' || Array.isArray(value)) {
                                errors.push(new CustomError(
                                    currentKey, 
                                    rule.message || t('validation.object')
                                ));
                            } else if (rule.schema) {
                                const nestedErrors = validateObjectProperties(value, rule.schema, currentKey);
                                errors.push(...nestedErrors);
                            }
                            break;
                        case 'array':
                            if (!Array.isArray(value)) {
                                errors.push(new CustomError(
                                    currentKey, 
                                    rule.message || t('validation.array')
                                ));
                            } else if (rule.itemSchema) {
                                value.forEach((item: any, index: number) => {
                                    if (typeof item === 'object' && item !== null) {
                                        const itemErrors = validateObjectProperties(
                                            item, 
                                            rule.itemSchema!, 
                                            `${currentKey}[${index}]`
                                        );
                                        errors.push(...itemErrors);
                                    }
                                });
                            }
                            break;
                    }
                }
            }
        }
    }
    return errors;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function errorhelper(error: any): CustomError[] {
    const errorlist: CustomError[] = [];
    let errorData: any = null;

    // --- Paso 1: Determinar la estructura del error ---

    // Prioridad 1: Error de Axios (la más común en llamadas HTTP)
    if (error && typeof error.data === 'object' && error.data !== null) {
        errorData = error.data;
    }
    else if (error && error.response && typeof error.response.data === 'object' && error.response.data !== null) {
        errorData = error.response.data;
    }
    // Prioridad 2: Si el error es un objeto Error nativo
    else if (error instanceof Error) {
        try {
            errorData = JSON.parse(error.message);
        } catch (e) {
            errorlist.push({ key: "error", message: error.message });
            return errorlist;
        }
    }
    // Prioridad 3: Si el error es un objeto JavaScript plano
    else if (typeof error === 'object' && error !== null) {
        errorData = error;
    }
    // Prioridad 4: Si el error es una cadena
    else if (typeof error === 'string') {
        try {
            errorData = JSON.parse(error);
        } catch (e) {
            errorlist.push({ key: "error", message: error });
            return errorlist;
        }
    }
    // Prioridad 5: Cualquier otro tipo
    else {
        errorlist.push({ key: "error", message: String(error) });
        return errorlist;
    }
    
    console.log(errorData);
    
    if (!errorData) {
        errorlist.push({ key: "desconocido", message: t('errors.unknown') });
        return errorlist;
    }

    // --- Paso 2: Extraer mensajes del objeto `errorData` ---

    // 1. Buscar y añadir mensajes generales
    if (errorData.Title && typeof errorData.Title === 'string') {
        if (!errorlist.some(item => item.key === "general" && item.message === errorData.Title)) {
            errorlist.push({ key: "general", message: errorData.Title });
        }
    }
    else if (errorData.Message && typeof errorData.Message === 'string') {
        if (!errorlist.some(item => item.key === "general" && item.message === errorData.Message)) {
            errorlist.push({ key: "general", message: errorData.Message });
        }
    }
    else if (errorData.message && typeof errorData.message === 'string') {
        if (!errorlist.some(item => item.key === "general" && item.message === errorData.message)) {
            errorlist.push({ key: "general", message: errorData.message });
        }
    }
    else if (errorData.data && typeof errorData.data === 'object') {
        if (errorData.data.Message && typeof errorData.data.Message === 'string') {
            if (!errorlist.some(item => item.key === "general" && item.message === errorData.data.Message)) {
                errorlist.push({ key: "general", message: errorData.data.Message });
            }
        }
        else if (errorData.data.message && typeof errorData.data.message === 'string') {
            if (!errorlist.some(item => item.key === "general" && item.message === errorData.data.message)) {
                errorlist.push({ key: "general", message: errorData.data.message });
            }
        }
    }

    // 2. Añadir los errores de validación específicos
    if (errorData.Errors && typeof errorData.Errors === 'object') {
        for (const key in errorData.Errors) {
            if (Object.prototype.hasOwnProperty.call(errorData.Errors, key) && Array.isArray(errorData.Errors[key])) {
                for (const message of errorData.Errors[key]) {
                    if (!errorlist.some(item => item.key === key && item.message === message)) {
                        errorlist.push({ key: key, message: message });
                    }
                }
            }
        }
    }

    if (errorData.errors && typeof errorData.errors === 'object') {
        for (const key in errorData.errors) {
            if (Object.prototype.hasOwnProperty.call(errorData.errors, key) && Array.isArray(errorData.errors[key])) {
                for (const message of errorData.errors[key]) {
                    if (!errorlist.some(item => item.key === key && item.message === message)) {
                        errorlist.push({ key: key, message: message });
                    }
                }
            }
        }
    }

    // 3. Mensajes de fallback
    if (errorlist.length === 0 && error && error.response && error.response.status && error.response.statusText) {
        errorlist.push({ key: "status", message: `Error ${error.response.status}: ${error.response.statusText}` });
    }
    else if (errorlist.length === 0 && error && typeof error.message === 'string') {
        errorlist.push({ key: "error", message: error.message });
    }

    if (errorlist.length === 0) {
        errorlist.push({ key: "inesperado", message: t('errors.unexpected') });
    }

    return errorlist;
}

/**
 * Verifica si una propiedad específica tiene un error de validación.
 * @param keyPath La ruta de la propiedad (ej. 'agencyModel.id').
 */
export function hasError(keyPath: string, errors: CustomError[]): boolean {
    return errors.some(error => error.key === keyPath);
}

/**
 * Obtiene el mensaje de error para una propiedad específica.
 * @param keyPath La ruta de la propiedad.
 */
export const getErrorMessage = (keyPath: string, errors: CustomError[]): string => {
    const error = errors.find(error => error.key === keyPath);
    return error ? error.message : '';
};

export async function urlToBase64(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error al descargar el archivo desde la URL: ${response.status}`);
            return null;
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Error al procesar la URL: ${error}`);
        return null;
    }
}

export function truncateToFirstSentence(text: string, limit: number) {
    console.log(text, 'test');
    const firstPeriodIndex = text.indexOf('.');

    if (firstPeriodIndex !== -1 && firstPeriodIndex < text.length - 1) {
        return text.substring(0, firstPeriodIndex + 1) + '...';
    }
    return truncateText(text, limit);
}

function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

export function enmascararString(texto: string): string {
    if (texto.length <= 4) {
        return texto;
    }
    const numAsteriscos = texto.length - 4;
    const asteriscos = "*".repeat(numAsteriscos);
    const ultimosCuatro = texto.slice(-4);
    return asteriscos + ultimosCuatro;
}


export function ValidateExpiry(expiryValue: string): boolean {
    if (expiryValue.length !== 4) {
        return false;
    }

    const mesExpiracionStr = expiryValue.slice(0, 2); // MM
    const añoExpiracionYY = expiryValue.slice(2);    // YY
    
    const mesExpiracionNum = Number(mesExpiracionStr);
    const añoExpiracionNum = Number(añoExpiracionYY);

    // 1. VALIDACIÓN BÁSICA DEL MES (1-12)
    if (mesExpiracionNum < 1 || mesExpiracionNum > 12) {
        return false;
    }

    // --- Lógica Dinámica del Siglo ---
    const añoActual = moment().year(); // e.g., 2025
    const sigloActual = Math.floor(añoActual / 100) * 100; // e.g., 2000
    const añoActualDosDigitos = añoActual % 100; // e.g., 25

    let añoCompleto;

    // Si el año de expiración (YY) es menor que el actual (25 > 30),
    // asumimos que es del próximo siglo (ej: 21XX, no 20XX)
    // Usamos una ventana de +/- 20 años hacia el futuro como margen de seguridad.
    if (añoExpiracionNum < añoActualDosDigitos - 20) {
        // Asumimos el siglo siguiente (e.g., de 2025, si llega 05, es 2105)
        añoCompleto = sigloActual + 100 + añoExpiracionNum;
    } else {
        // Asumimos el siglo actual (e.g., de 2025, si llega 28, es 2028)
        añoCompleto = sigloActual + añoExpiracionNum;
    }
    // ----------------------------------

    // 2. CREAR Y VALIDAR FECHA COMPLETA
    
    // El formato 'YYYY-MM-DD' asegura que Moment.js lo interprete correctamente.
    const fechaExpiracion = moment(`${añoCompleto}-${mesExpiracionStr}-01`, 'YYYY-MM-DD').endOf('month');
    
    const hoy = moment();
    
    // 3. COMPARACIÓN: Es válida si la fecha de expiración es igual o posterior a hoy.
    if (fechaExpiracion.isBefore(hoy)) {
        return false;
    }

    return true; // Tarjeta válida
}
