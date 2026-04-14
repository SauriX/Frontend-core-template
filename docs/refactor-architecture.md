# Refactorización Arquitectónica

## Estructura propuesta

```text
src/
  app/
    api/
    models/
    reporsitories/
    services/
    stores/
    util/
    validators/
  config/
  core/
    auth/
      strategies/
    localization/
  components/
  views/
```

## Qué se movió y por qué

- `core/auth`: concentra la selección de estrategia, el estado transversal de autenticación y la obtención del token.
- `core/localization`: expone un traductor con fallback para que utilidades, stores y validadores no dependan directamente de `vue-i18n`.
- `app/*`: conserva la lógica de negocio existente. La regla es que aquí vive el dominio de wallets, usuarios, catálogos y operaciones.
- `config/*`: queda como capa de integración con proveedores concretos, por ejemplo MSAL.

## Estrategias de autenticación

La estrategia activa se controla con `VITE_AUTH_STRATEGY=custom|msal`.

Si no se define, la app intenta restaurar la sesión previamente usada.

### Cambiar estrategia desde código

```ts
import { useAuth } from "@/config/useAuth";

const { setStrategy, login } = useAuth();

await setStrategy("msal");
await login();

await setStrategy("custom");
await login({
  username: "agent@example.com",
  password: "secret",
});
```

## Uso del validador custom

El validador sigue siendo `validateObjectProperties`. Solo se desacopló de `i18n` directo.

### Definir un esquema

```ts
import { ObjectValidationSchema } from "@/app/validators/validatorInterfaces/validationSchema";
import { translate } from "@/core/localization/translator";

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
```

### Usarlo en un componente

```ts
import { ref } from "vue";
import { validateObjectProperties, hasError, getErrorMessage } from "@/app/util/helpers";
import { ExampleUserSchema } from "@/app/validators/examples/exampleUserSchema";
import type { CustomError } from "@/app/models/errors";

const form = ref({
  firstName: "",
  email: "",
});

const errors = ref<CustomError[]>([]);

function submit() {
  errors.value = validateObjectProperties(form.value, ExampleUserSchema);

  if (errors.value.length > 0) {
    return;
  }
}
```

## Uso del API agent

El agente HTTP sigue siendo el punto único para requests. La diferencia es que ahora obtiene el token desde `authService`, sin asumir si proviene de MSAL o autenticación custom.

```ts
import requests from "@/app/api/agent";

const wallets = await requests.get("Wallets/GetAll", "wallet");
const created = await requests.post("Users/SignUp", payload, "usersb2b");
```

## i18n opcional

`vue-i18n` sigue disponible, pero el core ya no depende de él de forma rígida.

- Si `VITE_I18N_ENABLED=false`, el traductor devuelve `defaultMessage` o la clave.
- Los componentes pueden seguir usando `useI18n()` cuando lo necesiten.
- Utilidades, stores y validadores deben preferir `translate(...)`.

### Ejemplo

```ts
import { translate } from "@/core/localization/translator";

const title = translate("messages.errors.loginFailed", {
  defaultMessage: "Error de autenticación",
});
```

## Criterio práctico

- No se reescribió la lógica de negocio.
- No se removió MSAL.
- No se removió autenticación custom.
- No se reemplazó tu validador.
- Se introdujeron puntos de extensión pequeños para desacoplar dependencias transversales.
