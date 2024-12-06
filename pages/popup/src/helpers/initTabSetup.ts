import getCurrentTab from '@src/helpers/getCurrentTab';
import isInstagram from '@src/helpers/isInstagram';
import { useMainStore } from '@src/store';

export default async function initTabSetup() {
  const tab = await getCurrentTab();
  if (tab.url) useMainStore.setState({ isInstagram: isInstagram(tab.url) });
}
