export default function getCurrentTab(): Promise<chrome.tabs.Tab> {
  if (window.$tab) {
    return Promise.resolve(window.$tab);
  }

  return new Promise((resolve, reject) => {
    let retry = 0;
    const interval = setInterval(async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
        status: 'complete',
      });
      if (tab) {
        clearInterval(interval);
        window.$tab = tab;
        resolve(tab);
      }
      if (retry >= 10) {
        clearInterval(interval);
        reject('Tab not found');
      }
      retry++;
    }, 100);
  });
}
