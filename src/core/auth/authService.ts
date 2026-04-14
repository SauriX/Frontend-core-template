import { reactive } from "vue";
import { getStoredAuthProvider, setStoredAuthProvider } from "./authStorage";
import { CustomAuthStrategy } from "./strategies/customAuthStrategy";
import { MsalAuthStrategy } from "./strategies/msalAuthStrategy";
import type {
  AuthLoginPayload,
  AuthStrategy,
  AuthStrategyName,
  AuthVerifyPayload,
} from "./types";

const configuredStrategy = import.meta.env.VITE_AUTH_STRATEGY as AuthStrategyName | undefined;

const strategies: Record<AuthStrategyName, AuthStrategy> = {
  custom: new CustomAuthStrategy(),
  msal: new MsalAuthStrategy(),
};

function resolveInitialStrategy(): AuthStrategyName {
  if (configuredStrategy === "custom" || configuredStrategy === "msal") {
    return configuredStrategy;
  }

  return getStoredAuthProvider() ?? "custom";
}

function shouldLockStrategy(): boolean {
  return configuredStrategy === "custom" || configuredStrategy === "msal";
}

async function runInitialize(strategy: AuthStrategy) {
  if (strategy.initialize) {
    await strategy.initialize();
  }
}

export const authState = reactive({
  isReady: false,
  isAuthenticated: false,
  initialized: false,
  activeStrategy: resolveInitialStrategy(),
});

class AuthService {
  async initialize(): Promise<void> {
    if (authState.initialized) {
      return;
    }

    await runInitialize(strategies[authState.activeStrategy]);
    authState.initialized = true;
  }

  getAvailableStrategies(): AuthStrategy[] {
    return Object.values(strategies);
  }

  getActiveStrategy(): AuthStrategy {
    return strategies[authState.activeStrategy];
  }

  getActiveStrategyName(): AuthStrategyName {
    return authState.activeStrategy;
  }

  async setActiveStrategy(strategyName: AuthStrategyName): Promise<void> {
    if (!strategies[strategyName]) {
      return;
    }

    authState.activeStrategy = strategyName;
    setStoredAuthProvider(strategyName);
    await runInitialize(strategies[strategyName]);
    authState.initialized = true;
  }

  async restoreSession(): Promise<boolean> {
    await this.initialize();

    const primaryStrategy = this.getActiveStrategy();
    const primaryAuthenticated = await primaryStrategy.restoreSession();

    if (primaryAuthenticated) {
      authState.isReady = true;
      authState.isAuthenticated = true;
      return true;
    }

    if (!shouldLockStrategy()) {
      for (const strategy of this.getAvailableStrategies()) {
        if (strategy.name === primaryStrategy.name) {
          continue;
        }

        await runInitialize(strategy);
        const isAuthenticated = await strategy.restoreSession();

        if (isAuthenticated) {
          authState.activeStrategy = strategy.name;
          authState.initialized = true;
          authState.isReady = true;
          authState.isAuthenticated = true;
          return true;
        }
      }
    }

    authState.isReady = true;
    authState.isAuthenticated = false;
    return false;
  }

  async login(payload?: AuthLoginPayload): Promise<boolean> {
    await this.initialize();
    const isAuthenticated = await this.getActiveStrategy().login(payload);
    authState.isReady = true;
    authState.isAuthenticated = isAuthenticated;
    return isAuthenticated;
  }

  async verifyOtp(payload?: AuthVerifyPayload): Promise<boolean> {
    const strategy = this.getActiveStrategy();

    if (!strategy.verifyOtp) {
      return false;
    }

    const isAuthenticated = await strategy.verifyOtp(payload);
    authState.isAuthenticated = isAuthenticated;
    authState.isReady = true;
    return isAuthenticated;
  }

  async logout(): Promise<void> {
    await this.getActiveStrategy().logout();
    authState.isAuthenticated = false;
    authState.isReady = true;
  }

  async isAuthenticated(): Promise<boolean> {
    await this.initialize();
    return this.getActiveStrategy().isAuthenticated();
  }

  async getAuthorizationHeader(): Promise<string | null> {
    await this.initialize();
    const accessToken = await this.getActiveStrategy().getAccessToken();
    return accessToken ? `Bearer ${accessToken}` : null;
  }
}

export const authService = new AuthService();
