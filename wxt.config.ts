import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    author: {
      email: 'ts@tsuuko.dev',
    },
    version: '1.0.0',
    default_locale: 'en',
    permissions: ['contextMenus', 'activeTab', 'storage'],
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true,
    },
    action: {
      default_title: '__MSG_extensionName__',
    },
  },
  outDirTemplate: 'random-email-generator{{modeSuffix}}',
});
