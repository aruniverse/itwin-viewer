/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BrowserAuthorizationCallbackHandler,
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@bentley/frontend-authorization-client";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";

import { AuthType, AuthTypeKey, RedirectKey } from "./";

export class AuthorizationClient {
  private static _oidcClient: BrowserAuthorizationClient;

  public static get oidcClient(): BrowserAuthorizationClient {
    return this._oidcClient;
  }

  public static async initializeOidc() {
    if (this._oidcClient) {
      return;
    }

    const scope = process.env.REACT_APP_AUTH_CLIENT_SCOPES ?? "";
    const clientId = process.env.REACT_APP_AUTH_CLIENT_CLIENT_ID ?? "";
    const redirectUri = process.env.REACT_APP_AUTH_CLIENT_REDIRECT_URI ?? "";
    const postSignoutRedirectUri = process.env.REACT_APP_AUTH_CLIENT_LOGOUT_URI;

    // authority is optional and will default to Production IMS
    const oidcConfiguration: BrowserAuthorizationClientConfiguration = {
      clientId,
      redirectUri,
      postSignoutRedirectUri,
      scope,
      responseType: "code",
    };

    await BrowserAuthorizationCallbackHandler.handleSigninCallback(
      oidcConfiguration.redirectUri
    );

    this._oidcClient = new BrowserAuthorizationClient(oidcConfiguration);
  }

  public static async signIn(redirectPath?: string) {
    sessionStorage.setItem(AuthTypeKey, AuthType.IMODELJS);
    if (redirectPath) {
      sessionStorage.setItem(RedirectKey, redirectPath);
    }
    await this.oidcClient.signIn(new FrontendRequestContext());
  }

  public static async signOut(redirectPath?: string) {
    if (redirectPath) {
      sessionStorage.setItem(RedirectKey, redirectPath);
    }
    await this.oidcClient.signOut(new FrontendRequestContext());
  }
}
