import getCurrentTab from '@src/helpers/getCurrentTab';

export default async function sendMessage(message: any) {
  const tab = await getCurrentTab();

  if (!tab.id) {
    throw new Error('Tab not found');
  }

  return chrome.tabs.sendMessage(tab.id, message);
}
