import axios, { AxiosResponse } from "axios";
import messages from "../util/messages";
import responses from "../util/responses";
import { authService } from "@/core/auth/authService";
import { translate } from "@/core/localization/translator";


axios.interceptors.request.use(
  async (config) => {
    const authorizationHeader = await authService.getAuthorizationHeader();

    if (authorizationHeader) {
      config.headers.Authorization = authorizationHeader;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async (response) => {
    // Validar si el campo `success` es falso
/*     if (response.data && response.data.success === false) {
      response.data.message = messages.serverError;
      const error = new Error(JSON.stringify(response.data));

      throw error;
    }
 */
    // Si `success` es verdadero, simplemente retorna la respuesta
    return response;
  },
  async (error) => {
    if (error.message === "Network Error" && !error.response) {
      throw new Error(JSON.stringify({ Message: translate('messages.networkError', { defaultMessage: 'Network error' })  }));
    }

    const { status } = error?.response;

    if (status === responses.forbidden) {
      throw new Error(JSON.stringify({ Message: translate('messages.forbidden', { defaultMessage: 'Access denied' })  }));
    }
    if (status === responses.unauthorized) {
      throw new Error(JSON.stringify({ Message: translate('messages.forbidden', { defaultMessage: 'Access denied' })  }));
    }

    if (status === responses.internalServerError) {
      throw new Error(JSON.stringify({ Message: translate('messages.serverError', { defaultMessage: 'Server error' })  }));
    }

    if (status === responses.gatewayTimeout) {
      throw new Error(JSON.stringify({ Message: translate('messages.timeout', { defaultMessage: 'Request timeout' })  }));
    }

    if (error.response.request.responseType === "blob") {
      const text = await new Response(error.response.data).text();
      const json = JSON.parse(text);
      error.response.data = json;
    }

    throw error.response;
  }
);

const responseBody = (response: AxiosResponse) => response?.data;
const responseB = (response: AxiosResponse) => response;

export const apiBaseURLs: Record<string, string> = {
  base: import.meta.env.VITE_BASE_URL || "",
};

const getBaseURL = (api: string) => {
  return apiBaseURLs[api] ?? apiBaseURLs["base"];
};
const requests = {
  get: (url: string, api = "base") =>
    axios
      .get(url, {
        baseURL: getBaseURL(api),
      })
      .then(responseBody),
  getfull: (url: string, api = "base") =>
    axios
      .get(url, {
        baseURL: getBaseURL(api),
      })
      .then(responseB),

  post: (url: string, data: {} | FormData, api = "base") =>
    axios
      .post(url, data, {
        baseURL: getBaseURL(api),
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        timeout: 120000 
      })
      .then(responseBody),
  patch: (url: string, data: {} | FormData, api = "base") =>
    axios
      .patch(url, data, {
        baseURL: getBaseURL(api),
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then(responseBody),
  put: (url: string, data: {} | FormData, api = "base") =>
    axios
      .put(url, data, {
        baseURL: getBaseURL(api),
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then(responseBody),
  delete: (url: string, api = "base") =>
    axios
      .delete(url, {
        baseURL: getBaseURL(api),
      })
      .then(responseBody),
  download: (url: string, data?: Object | FormData, name:string="" ,api = "base") =>
    axios
      .post(url, data ?? {}, {
        baseURL: url.startsWith("http") ? undefined : getBaseURL(api),
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (
          response.data &&
          response.data.Success &&
          response.data.Data &&
          response.data.Data.WorksheetBase64
        ) {
          const base64String = response.data.Data.WorksheetBase64;
          const contentType =
            response.data.Data.ContentType ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          // Decodificar la cadena Base64
          const binaryString = atob(base64String);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Crear un Blob con los datos binarios y el tipo de contenido correcto
          const blob = new Blob([bytes], { type: contentType });
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
  
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(downloadUrl); // Liberar el objeto URL
        }
      }),
      downloadget: (url: string, name="plantilla.xlsx" ,api = "base") =>
      axios
        .get(url, {
          baseURL: url.startsWith("http") ? undefined : getBaseURL(api),
        })
        .then((response) => {
          if (
            response.data &&
            response.data.Success &&
            response.data.Data &&
            response.data.Data.WorksheetBase64
          ) {
            const base64String = response.data.Data.WorksheetBase64;
            const contentType =
              response.data.Data.ContentType ||
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  
            // Decodificar la cadena Base64
            const binaryString = atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
  
            // Crear un Blob con los datos binarios y el tipo de contenido correcto
            const blob = new Blob([bytes], { type: contentType });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
    
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          window.URL.revokeObjectURL(downloadUrl); // Liberar el objeto URL
          }
        }),
  
  print: (
    urlbase: string,
    data?: Object | FormData,
    api = "base"
  ): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      // Abrir la URL en una nueva pestaña
      try {
        const link = document.createElement("a");
        link.href = urlbase;
        link.target = "_blank"; // Abre en una nueva pestaña
        document.body.appendChild(link); // Agregar el enlace al DOM
        link.click(); // Hacer clic programáticamente en el enlace
        document.body.removeChild(link); // Eliminar el enlace del DOM

        const iframe = document.createElement("iframe");
        iframe.style.display = "none"; // Hace que el iframe sea invisible
        iframe.src = urlbase;
        document.body.appendChild(iframe);

        // Intentar abrir la URL en una nueva pestaña
        //let newTab = window.open(urlbase, "_blank", "noopener,noreferrer");
        //if (!newTab) {
        // Si no se puede abrir la nueva pestaña, rechazar la promesa
        //  reject(new Error("No se pudo abrir la pestaña nueva. Verifica las configuraciones del navegador."));
        /*          setTimeout(() => {
            newTab = window.open(urlbase, "_blank","rel=noopener");
            if (!newTab) {
              requests.print(urlbase);
            }
          }, 500); */
        //}

        // Aquí iría el resto de la lógica si la pestaña se abre correctamente
        resolve();
      } catch (error: any) {
        // Si ocurre un error, mostrarlo en un alert

        reject(error); // Rechazar la promesa
      }
    }),

  getFileUrl: (
    url: string,
    data?: Object | FormData,
    api: string = "base" // 'api' se mantiene con valor por defecto
  ): Promise<string> => // La función sigue devolviendo una Promise<string> (la URL del blob)
    axios
      .post<Blob>(url, data ?? {}, {
        // Especificamos que esperamos un Blob como respuesta
        baseURL: getBaseURL(api),
        responseType: "blob", // Crucial para obtener el archivo como Blob
        headers:
          data instanceof FormData // <-- Corrección aquí: Usar 'data' directamente
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then((response: AxiosResponse<Blob>) => {
        // Especificamos el tipo de respuesta de Axios
        // Obtener el Content-Type de los headers de la respuesta de Axios
        const contentType = response.headers["content-type"];

        // Asegurarse de que hay datos y un Content-Type
        if (!response.data || !contentType) {
          throw new Error(
            "No se pudo obtener el blob o el Content-Type de la respuesta."
          );
        }

        // Crear el Blob con los datos recibidos y el tipo de contenido detectado
        const fileBlob = new Blob([response.data], { type: contentType });

        // Crear una URL de objeto para el Blob
        const objectUrl = window.URL.createObjectURL(fileBlob);

        return objectUrl;
      }),
  getBlobFromDirectLink: (directFileUrl: string): Promise<Blob> =>
    axios
      .get<Blob>(directFileUrl, {
        // `axios.get` retorna una promesa
        responseType: "blob", // Indica que esperamos un Blob como respuesta
      })
      .then((response: AxiosResponse<Blob>) => {
        // Usamos .then() para manejar la respuesta exitosa
        const contentType = response.headers["content-type"];

        if (!response.data || !contentType) {
          throw new Error(
            "No se pudo obtener el blob o el Content-Type de la respuesta de la URL directa."
          );
        }

        const fileBlob = new Blob([response.data], { type: contentType });

        return fileBlob; // Retornamos la URL de objeto del Blob
      }),
};

export default requests;

