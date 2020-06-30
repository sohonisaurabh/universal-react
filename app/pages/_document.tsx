import React, { Fragment } from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

//@ts-ignore - Not sure why this is imported
import styles from '../styles'; // eslint-disable-line no-unused-vars
import catchErrors from '../utils/errorBoundary';

import cssIncludes from '../styles/cssIncludes';
import { MOBILE, DESKTOP } from '../constants';

interface Props {
  styleTags: Array<React.ReactElement<{}>>;
}

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: any) {
    const { device = {} } = ctx.req || {};
    const deviceType = device.type === DESKTOP ? DESKTOP : MOBILE;
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
        deviceType,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const Content = catchErrors(Main);
    const { styleTags } = this.props;

    return (
      <html lang="en">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
          <link rel="manifest" href="/static/manifest.json" />
          {cssIncludes.map(css => (
            <Fragment key={`fragment-${css.id}`}>
              <link type="text/css" rel="stylesheet" href={css.src} />
            </Fragment>
          ))}
          {styleTags}
        </Head>
        <body className="app">
          <noscript>Javascript is required for this page</noscript>
          <Content />
          <NextScript />
        </body>
      </html>
    );
  }
}
