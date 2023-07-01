import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "@/pages/popup/Popup";
import "@/pages/popup/index.css";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import getCurrentTab from "@/pages/helpers/getCurrentTab";
import { useMainStore } from "@/pages/popup/store";
import isInstagram from "@/pages/helpers/isInstagram";
import initTabSetup from "@/pages/helpers/initTabSetup";

refreshOnUpdate("pages/popup");

async function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  await initTabSetup();
  root.render(<Popup />);
}

init().catch(console.error);
