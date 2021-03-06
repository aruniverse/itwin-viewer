/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer, ViewerExtension } from "@bentley/itwin-viewer-react";
import React, { useState } from "react";
import { useLocation } from "react-router";

import { oidcClient } from "../../services/auth/AuthInstances";
import { Header } from "./";
import styles from "./Home.module.scss";

export const UserManagerHome = () => {
  const [loggedIn, setLoggedIn] = useState(oidcClient.loggedIn);
  const location = useLocation();
  const extensions: ViewerExtension[] = [
    {
      name: "dialogItemsSample",
      url: "http://localhost:3000",
    },
  ];
  /**
   * This value is for the iTwin Viewer and will be the default if the productId prop is not provided.
   * This is merely an example on how to use the prop to override with your application's GPRID.
   */
  const productId = "3098";

  const toggleLogin = async () => {
    if (!loggedIn) {
      await oidcClient.signIn(location.pathname);
      if (oidcClient.loggedIn) {
        setLoggedIn(true);
      }
    } else {
      await oidcClient.signOut(location.pathname);
      setLoggedIn(false);
    }
  };

  return (
    <div className={styles.home}>
      <Header handleLoginToggle={toggleLogin} loggedIn={loggedIn} />
      {loggedIn && (
        <Viewer
          authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
          projectId={process.env.REACT_APP_OIDC_CLIENT_PROJECT_ID as string}
          iModelId={process.env.REACT_APP_OIDC_CLIENT_IMODEL_ID as string}
          extensions={extensions}
          productId={productId}
        />
      )}
    </div>
  );
};
