export default function getCurrentTab(): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab) {
        return reject(new Error("No active tab"));
      } else {
        return resolve(tab);
      }
    });
  });
}
