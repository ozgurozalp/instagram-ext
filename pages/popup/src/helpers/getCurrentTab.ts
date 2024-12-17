const getTab = () => chrome.tabs.query({ active: true, currentWindow: true });

export default async function getCurrentTab() {
  if (window.$tab) {
    return Promise.resolve(window.$tab);
  }

  const [tab] = await getTab();

  if (tab) {
    window.$tab = tab;
    return Promise.resolve(tab);
  }

  return new Promise((resolve, reject) => {
    let retry = 0;
    const maxRetries = 10;
    const intervalDuration = 1000;

    const interval = setInterval(async () => {
      try {
        const [tab] = await getTab();

        if (tab) {
          clearInterval(interval);
          window.$tab = tab;
          return resolve(tab);
        } else if (retry >= maxRetries) {
          clearInterval(interval);
          return reject(new Error('Tab not found'));
        }
      } catch (error: any) {
        clearInterval(interval);
        return reject(new Error('Error querying tabs: ' + error?.message));
      }

      retry++;
    }, intervalDuration);
  });
}
