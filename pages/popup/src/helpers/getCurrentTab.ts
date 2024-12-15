export default function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    if (window.$tab) {
      return resolve(window.$tab);
    }

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
        return resolve(tab);
      }
      if (retry >= 10) {
        clearInterval(interval);
        return reject('Tab not found');
      }
      retry++;
    }, 100);
  });
}
