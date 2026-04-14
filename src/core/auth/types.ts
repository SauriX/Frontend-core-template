export type AuthStrategyName = "custom" | "msal";

export interface AuthLoginPayload {
  username?: string;
  password?: string;
}

export interface AuthVerifyPayload {
  otp?: string;
}

export interface AuthStrategy {
  readonly name: AuthStrategyName;
  readonly supportsCredentials: boolean;
  readonly supportsMfa: boolean;
  initialize?: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  login: (payload?: AuthLoginPayload) => Promise<boolean>;
  verifyOtp?: (payload?: AuthVerifyPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  getCurrentUser: () => Promise<unknown | null>;
}
