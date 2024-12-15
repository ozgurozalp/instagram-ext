import { createRoot } from 'react-dom/client';
import '@extension/ui/dist/global.css';
import '@src/index.css';
import Popup from '@src/Popup';
import initTabSetup from '@src/helpers/initTabSetup';
import * as Sentry from '@sentry/react';

import './i18n';

async function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  Sentry.init({
    dsn: 'https://d9c194b14eed5aa9c8278dd7316cb969@o4508474214514689.ingest.de.sentry.io/4508474223427664',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  const root = createRoot(appContainer);
  await initTabSetup();
  root.render(<Popup />);
}

init();
