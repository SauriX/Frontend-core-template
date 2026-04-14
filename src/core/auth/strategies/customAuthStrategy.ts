import { clearStoredAuthProvider, setStoredAuthProvider } from "../authStorage";
import type { AuthLoginPayload, AuthStrategy, AuthVerifyPayload } from "../types";

const STORAGE_KEY_USER = "custom_auth_user";
const STORAGE_KEY_TOKEN = "custom_auth_token";

interface CustomAuthUser {
  username: string;
  token: string;
}

let currentUser: CustomAuthUser | null = null;

function persistCurrentUser(user: CustomAuthUser | null) {
  currentUser = user;

  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, user.username);
    localStorage.setItem(STORAGE_KEY_TOKEN, user.token);
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }
}

export class CustomAuthStrategy implements AuthStrategy {
  readonly name = "custom" as const;
  readonly supportsCredentials = true;
  readonly supportsMfa = true;

  async restoreSession(): Promise<boolean> {
    if (currentUser) {
      setStoredAuthProvider(this.name);
      return true;
    }

    const username = localStorage.getItem(STORAGE_KEY_USER);
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);

    if (!username || !token) {
      return false;
    }

    currentUser = { username, token };
    setStoredAuthProvider(this.name);
    return true;
  }

  async login(payload?: AuthLoginPayload): Promise<boolean> {
    if (!payload?.username || !payload.password) {
      return false;
    }

    persistCurrentUser({
      username: payload.username,
      token: `custom-token-${Math.random().toString(36).slice(2)}`,
    });

    localStorage.setItem("custom_login_request", JSON.stringify(payload));
    setStoredAuthProvider(this.name);
    return true;
  }

  async verifyOtp(payload?: AuthVerifyPayload): Promise<boolean> {
    if (!payload?.otp || !payload.otp.trim().length) {
      return false;
    }

    if (!currentUser) {
      await this.restoreSession();
    }

    return currentUser !== null;
  }

  async logout(): Promise<void> {
    persistCurrentUser(null);
    clearStoredAuthProvider();
  }

  async isAuthenticated(): Promise<boolean> {
    if (!currentUser) {
      await this.restoreSession();
    }

    return currentUser !== null;
  }

  async getAccessToken(): Promise<string | null> {
    if (!currentUser) {
      await this.restoreSession();
    }

    return currentUser?.token ?? null;
  }

  async getCurrentUser(): Promise<unknown | null> {
    if (!currentUser) {
      await this.restoreSession();
    }

    return currentUser;
  }
}
