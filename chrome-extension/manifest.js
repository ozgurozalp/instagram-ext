import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

const sidePanelConfig = {};

const allowedSites = ['https://*.instagram.com/*', 'https://*.cdninstagram.com/*', 'https://*.fbcdn.net/*'];

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
    default_locale: 'en',
    name: '__MSG_extensionName__',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    host_permissions: allowedSites,
    permissions: [],
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: {
        16: '/icon-16.png',
        32: '/icon-32.png',
        128: '/icon-128.png',
      },
    },
    icons: {
      16: '/icon-16.png',
      32: '/icon-32.png',
      128: '/icon-128.png',
    },
    content_scripts: [
      {
        matches: allowedSites,
        js: ['content/index.iife.js'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', '*.png'],
        matches: ['*://*/*'],
      },
    ],
  },
  !isFirefox && sidePanelConfig,
);

export default manifest;
