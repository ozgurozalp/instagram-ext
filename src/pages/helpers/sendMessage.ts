export default function sendMessage(data = {}) {
  chrome.runtime.sendMessage(data);
}
