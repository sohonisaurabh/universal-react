const webpack = require('webpack');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');
const Terser = require('terser');
const minify = require('harp-minify');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Buildify = require('buildify');
const path = require('path');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withPlugins = require('next-compose-plugins');
const { ENV_DEVELOPMENT } = require('../isomorphic/constants');

const { parsed: envVars } = dotenv.config({
  path: path.resolve(
    __dirname,
    `..${path.sep}env${path.sep}${process.env.NODE_ENV || ENV_DEVELOPMENT}.env`
  ),
});

const metricsKey = process.env.ENV_API_KEY === process.env.PROD_KEY ? 'prod' : 'dev';

module.exports = withPlugins([withBundleAnalyzer, withOffline], {
  distDir: '../.next',
  webpack: (config, { dev, buildId, isServer }) => {
    config.plugins.push(new webpack.EnvironmentPlugin(envVars));

    config.module.rules.push({
      test: /\.css$/,
      use: ['babel-loader', 'raw-loader'],
    });

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js']) {
        entries['main.js'].unshift(
          path.resolve(__dirname, `.${path.sep}static${path.sep}libs${path.sep}polyfills.js`)
        );
      }
      return entries;
    };

    if (isServer) {
      const foundation = {
        destPath: '.next/static/styles/vendor/',
        files: [
          'node_modules/normalize.css/normalize.css',
          'node_modules/flexboxgrid/css/flexboxgrid.css',
          'app/static/styles/icons/icomoon.css',
        ],
        fileName: 'foundation',
      };

      Buildify()
        .setDir(path.resolve(__dirname, '../'))
        .concat(foundation.files)
        .cssmin()
        .save(`${foundation.destPath}${foundation.fileName}.css`);
    }
    config.plugins.push(
      new CopyWebpackPlugin(
        [
          {
            from: path.join(__dirname, '/static/**/*'),
            to: path.join(__dirname, '../.next'),
            transformPath(targePath) {
              return targePath.replace(/(\/static\/)/, (match, p1) => `${p1}${buildId}/`);
            },
            transform(content, filePath) {
              if (filePath.endsWith('.css')) {
                return minify.css(content.toString());
              }
              if (filePath.endsWith('.js') && filePath.indexOf('polyfills') === -1) {
                return Terser.minify(content.toString()).code;
              }
              return content;
            },
          },
        ],
        {}
      )
    );

    // Following check is for prod builds and client only
    if (!dev && !isServer) {
      // TODO: revisit service worker approach
      // config.plugins.push(new SWPrecacheWebpackPlugin({
      //   verbose: true,
      //   staticFileGlobsIgnorePatterns: [/\.next\//],
      //   runtimeCaching: [
      //     {
      //       handler: 'networkFirst',
      //       urlPattern: /^https?.*/,
      //     },
      //   ],
      // }));

      /* eslint no-param-reassign:0 */
      // const oldEntry = config.entry;
      //
      // config.entry = () =>
      //   oldEntry().then((entry) => {
      //     entry['main.js'].push(path.resolve(__dirname,
      //          `.${path.sep}lib${path.sep}pwa${path.sep}offline.js`));
      //     return entry;
      //   });

      config.resolve = {
        ...config.resolve,
        alias: {
          ...(config.resolve.alias || {}),
          winston: path.resolve(__dirname, 'lib/fake/winston.js'),
          'winston-logrotate': path.resolve(__dirname, 'lib/fake/winston.js'),
          'memory-cache': path.resolve(__dirname, 'lib/fake/memory-cache.js'),
          fs: path.resolve(__dirname, 'lib/fake/fs.js'),
        },
      };

      config.plugins.push(
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: true,
            mangle: true,
          },
          sourceMap: false,
        })
      );
    }

    return config;
  },
  analyzeServer: process.env.NODE_ENV === 'production',
  analyzeBrowser: process.env.NODE_ENV === 'production',
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, '../../reports/bundleAnalyzer/report-server.html'),
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, '../../reports/bundleAnalyzer/report-client.html'),
    },
  },
  publicRuntimeConfig: {
    metricsKey,
    isCachingEnabled: process.env.CACHE_ENABLED !== 'false',
    isProd: process.env.PROD_ENV === 'true',
  },
  workboxOpts: {
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: '/',
        handler: 'NetworkFirst',
      },
      {
        urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 30,
          },
        },
      },
      {
        urlPattern: /.*\.(?:|woff2|woff|ttf)/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'font-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        },
      },
      {
        urlPattern: /\/api\/b/,
        handler: 'NetworkFirst',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  exportPathMap: async () => {
    return {
      '/': { page: '/' },
    };
  },
});
