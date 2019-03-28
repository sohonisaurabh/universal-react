module.exports = {
  clientsClaim: true,
  skipWaiting: true,
  globPatterns: ['.next/static/*', '.next/static/commons/*'],
  modifyUrlPrefix: {
    '.next': '/_next',
  },
  runtimeCaching: [
    {
      urlPattern: '/',
      handler: 'networkFirst',
      options: {
        cacheName: 'html-cache',
      },
    },
    {
      urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|woff2|woff|ttf)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'image-cache',
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /.*\.(?:js|css)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'static-cache',
      },
    },
  ],
};
