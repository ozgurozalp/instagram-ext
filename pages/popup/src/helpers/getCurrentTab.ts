export default function getCurrentTab() {
  return new Promise((resolve, reject) => {
    if (window.$tab) {
      resolve(window.$tab);
      return;
    }

    let retry = 0;
    const maxRetries = 10;
    const intervalDuration = 1000;

    const interval = setInterval(async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab) {
          clearInterval(interval);
          window.$tab = tab;
          resolve(tab);
        } else if (retry >= maxRetries) {
          clearInterval(interval);
          reject(new Error('Tab not found'));
        }
      } catch (error: any) {
        clearInterval(interval);
        reject(new Error('Error querying tabs: ' + error?.message));
      }

      retry++;
    }, intervalDuration);
  });
}
