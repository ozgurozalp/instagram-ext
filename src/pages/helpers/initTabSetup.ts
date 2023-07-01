import getCurrentTab from "@/pages/helpers/getCurrentTab";
import { useMainStore } from "@/pages/popup/store";
import isInstagram from "@/pages/helpers/isInstagram";

export default async function initTabSetup() {
  const tab = await getCurrentTab();
  window.$tab = tab;
  window.$connection = chrome.tabs.connect(tab.id);
  useMainStore.setState({ isInstagram: isInstagram(tab.url) });
}
