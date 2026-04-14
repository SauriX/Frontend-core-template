import { PublicClientApplication, type AccountInfo, type RedirectRequest } from "@azure/msal-browser";
import { reactive } from "vue";

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID!,
        authority: import.meta.env.VITE_AUTHORITY!,
        redirectUri: import.meta.env.VITE_REDIRECT_URI!,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    },
}

export const graphScopes: RedirectRequest = {
    scopes: ['user.read', 'openid', 'profile']
}

export const graphScpes = graphScopes;

export const state = reactive({ isAuthenticated: false, user: null as AccountInfo | null });

export const myMSALObj = new PublicClientApplication(msalConfig);
