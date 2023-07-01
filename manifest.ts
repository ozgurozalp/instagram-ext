import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Instagram unfollowers chrome extension",
  version: packageJson.version,
  description: packageJson.description,
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: {
      "16": "images/instagram16.png",
      "32": "images/instagram32.png",
      "128": "images/instagram128.png",
    },
  },
  icons: {
    "16": "images/instagram16.png",
    "32": "images/instagram32.png",
    "128": "images/instagram128.png",
  },
  permissions: ["tabs", "activeTab", "scripting"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "images/instagram16.png",
        "images/instagram32.png",
        "images/instagram128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
