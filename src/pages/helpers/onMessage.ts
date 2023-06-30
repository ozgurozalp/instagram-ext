export default function onMessage(callback) {
  chrome.runtime.onMessage.addListener(callback);
}
