/**
 * encryptPayment.ts - Solución al error de Base64 inválido.
 *
 * Utiliza Base64 estándar (btoa) para asegurar compatibilidad
 * con Convert.FromBase64String en el backend de C#.
 */

//
// --- Base64 / Utilitarios ---
//

// Función para codificar un ArrayBuffer a Base64 estándar (utiliza +, /)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // btoa() siempre produce Base64 estándar
    return btoa(binary);
}

// Función para limpiar la clave PEM
function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN [A-Z ]+-----/g, "")
        .replace(/-----END [A-Z ]+-----/g, "")
        .replace(/\s+/g, "");
    console.log(b64);
    // Decodifica la Base64 (requiere la función auxiliar base64ToArrayBuffer)
    return base64ToArrayBuffer(b64);
}

// Función auxiliar para importar una clave pública desde un ArrayBuffer Base64 (necesaria para pemToArrayBuffer)
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    // Aquí usamos atob, que decodifica Base64 estándar.
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

async function importPublicKey(pem: string): Promise<CryptoKey> {
    const keyBuffer = pemToArrayBuffer(pem);
    return await crypto.subtle.importKey(
        "spki",
        keyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );
}

//
// --- Función Principal de Cifrado Híbrido ---
//

export async function encryptPayment(
    publicKeyPem: string,
    data: any
): Promise<{
    encryptedKey: string;
    iv: string;
    ciphertext: string;
}> {
    console.log(data,'data');
    // 1. Generar clave AES-GCM (256 bits)
    const aesKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 } as AesKeyGenParams,
        true, // extractable: true (Esto es lo que permite usar .exportKey)
        ["encrypt"] // Usos: Cifrar datos y permitir el "envolvimiento" (cifrado por RSA)
    );

    // 2. Generar IV de 12 bytes (estándar para AES-GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 3. Cifrar el JSON con AES-GCM
    const plaintext = new TextEncoder().encode(JSON.stringify(data));
    const ciphertextBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        plaintext
    );

    // 4. Exportar la clave AES en formato RAW (32 bytes)
    const rawAES = await crypto.subtle.exportKey("raw", aesKey);

    // 5. Cifrar la clave AES con RSA-OAEP
    const rsaKey = await importPublicKey(publicKeyPem);
    const encryptedAES = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        rsaKey,
        rawAES
    );

    // 6. Codificar todos los resultados a Base64 estándar
    return {
        // Clave AES cifrada por RSA
        encryptedKey: arrayBufferToBase64(encryptedAES),
        // IV para AES-GCM
        iv: arrayBufferToBase64(iv.buffer),
        // Datos cifrados
        ciphertext: arrayBufferToBase64(ciphertextBuffer),
    };
}