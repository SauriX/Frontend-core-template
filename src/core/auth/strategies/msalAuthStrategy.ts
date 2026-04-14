import { myMSALObj, graphScopes } from "@/config/msalConfig";
import { clearStoredAuthProvider, setStoredAuthProvider } from "../authStorage";
import type { AuthStrategy } from "../types";

export class MsalAuthStrategy implements AuthStrategy {
  readonly name = "msal" as const;
  readonly supportsCredentials = false;
  readonly supportsMfa = false;

  async initialize(): Promise<void> {
    await myMSALObj.initialize();
  }

  async restoreSession(): Promise<boolean> {
    await this.initialize();

    const redirectResult = await myMSALObj.handleRedirectPromise();
    const account =
      redirectResult?.account ??
      myMSALObj.getActiveAccount() ??
      myMSALObj.getAllAccounts()[0] ??
      null;

    if (!account) {
      return false;
    }

    myMSALObj.setActiveAccount(account);
    setStoredAuthProvider(this.name);
    return true;
  }

  async login(): Promise<boolean> {
    await this.initialize();
    setStoredAuthProvider(this.name);
    await myMSALObj.loginRedirect(graphScopes);
    return true;
  }

  async logout(): Promise<void> {
    await this.initialize();
    const account = myMSALObj.getActiveAccount() ?? myMSALObj.getAllAccounts()[0];
    clearStoredAuthProvider();
    await myMSALObj.logoutRedirect(account ? { account } : undefined);
  }

  async isAuthenticated(): Promise<boolean> {
    await this.initialize();
    return !!(myMSALObj.getActiveAccount() ?? myMSALObj.getAllAccounts()[0]);
  }

  async getAccessToken(): Promise<string | null> {
    await this.initialize();
    const account = myMSALObj.getActiveAccount() ?? myMSALObj.getAllAccounts()[0];

    if (!account) {
      return null;
    }

    myMSALObj.setActiveAccount(account);

    try {
      const response = await myMSALObj.acquireTokenSilent({
        ...graphScopes,
        account,
      });

      return response.accessToken ?? null;
    } catch (error) {
      return null;
    }
  }

  async getCurrentUser(): Promise<unknown | null> {
    await this.initialize();
    return myMSALObj.getActiveAccount() ?? myMSALObj.getAllAccounts()[0] ?? null;
  }
}
