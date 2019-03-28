const path = require('path');

module.exports = {
  filename: 'static/manifest.json',
  name: 'Next PWA',
  short_name: 'Next-PWA',
  description: 'PWA App',
  background_color: '#ffffff',
  theme_color: '#5755d9',
  display: 'standalone',
  orientation: 'portrait',
  fingerprints: false,
  inject: false,
  start_url: '/',
  ios: {
    'apple-mobile-web-app-title': 'Next-PWA',
    'apple-mobile-web-app-status-bar-style': '#5755d9',
  },
  icons: [
    {
      src: path.resolve('app/static/images/icon.png'),
      sizes: [96, 128, 192, 256, 384, 512],
      destination: '/static',
    },
  ],
};
