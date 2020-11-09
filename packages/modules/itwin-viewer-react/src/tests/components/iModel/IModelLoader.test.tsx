/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BackstageItemUtilities } from "@bentley/ui-abstract";
import { FrontstageProps, FrontstageProvider } from "@bentley/ui-framework";
import { render } from "@testing-library/react";
import React from "react";

import IModelLoader from "../../../components/iModel/IModelLoader";
import { ViewerBackstageItem, ViewerFrontstage } from "../../../types";

jest.mock("@bentley/ui-framework");
jest.mock("@bentley/ui-abstract");
jest.mock("@microsoft/applicationinsights-react-js");

jest.mock("@bentley/imodeljs-frontend", () => {
  return {
    IModelApp: {
      startup: jest.fn(),
      extensionAdmin: {
        addExtensionLoaderFront: jest.fn(),
        loadExtension: jest.fn().mockResolvedValue(true),
      },
      telemetry: {
        addClient: jest.fn(),
      },
      i18n: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        languageList: jest.fn().mockReturnValue(["en-US"]),
        translate: jest.fn(),
      },
    },
    SnapMode: {},
    ActivityMessageDetails: jest.fn(),
    PrimitiveTool: jest.fn(),
    NotificationManager: jest.fn(),
    ExternalServerExtensionLoader: jest.fn(),
    Tool: jest.fn(),
    RemoteBriefcaseConnection: {
      open: jest.fn(),
    },
    SnapshotConnection: {
      openFile: jest.fn(),
    },
  };
});

class Frontstage1Provider extends FrontstageProvider {
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

class Frontstage2Provider extends FrontstageProvider {
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

describe("IModelLoader", () => {
  it("translate backstage item labels properly", () => {
    const fs1 = new Frontstage1Provider();
    const fs2 = new Frontstage2Provider();
    const frontstages: ViewerFrontstage[] = [
      {
        provider: fs1,
      },
      {
        provider: fs2,
        default: true,
      },
    ];

    const backstageItems: ViewerBackstageItem[] = [
      {
        id: "bs1",
        execute: jest.fn(),
        groupPriority: 100,
        itemPriority: 1,
        label: "",
        labeli18nKey: "bs1Key",
      },
      {
        id: "bs2",
        stageId: "bs2",
        groupPriority: 100,
        itemPriority: 2,
        label: "",
        labeli18nKey: "bs2Key",
      },
    ];
    render(
      <IModelLoader frontstages={frontstages} backstageItems={backstageItems} />
    );
    expect(BackstageItemUtilities.createStageLauncher).toHaveBeenCalled();
    expect(BackstageItemUtilities.createActionItem).toHaveBeenCalled();
  });
});