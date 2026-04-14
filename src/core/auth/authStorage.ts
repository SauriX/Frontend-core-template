import type { AuthStrategyName } from "./types";

const AUTH_PROVIDER_KEY = "auth_provider";

export function getStoredAuthProvider(): AuthStrategyName | null {
  const value = localStorage.getItem(AUTH_PROVIDER_KEY);

  if (value === "custom" || value === "msal") {
    return value;
  }

  return null;
}

export function setStoredAuthProvider(provider: AuthStrategyName) {
  localStorage.setItem(AUTH_PROVIDER_KEY, provider);
}

export function clearStoredAuthProvider() {
  localStorage.removeItem(AUTH_PROVIDER_KEY);
}
