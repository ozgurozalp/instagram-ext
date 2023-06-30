import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "@pages/popup/Popup";
import "@pages/popup/index.css";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { getCurrentTab } from "@pages/helpers";

refreshOnUpdate("pages/popup");

async function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);

  const tab = await getCurrentTab();
  window.$tab = tab;
  window.$connection = chrome.tabs.connect(tab.id);
  root.render(<Popup />);
}

init().catch(console.error);
