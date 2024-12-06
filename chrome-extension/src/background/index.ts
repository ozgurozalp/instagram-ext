let popupPort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener(port => {
  popupPort = port;
  port.onDisconnect.addListener(() => {
    popupPort = null;
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ reply: 'ok' });
  if (popupPort) popupPort.postMessage(message);
});
