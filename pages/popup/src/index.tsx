import { createRoot } from 'react-dom/client';
import '@extension/ui/dist/global.css';
import '@src/index.css';
import Popup from '@src/Popup';
import initTabSetup from '@src/helpers/initTabSetup';
import './i18n';

async function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  await initTabSetup();
  root.render(<Popup />);
}

init();
