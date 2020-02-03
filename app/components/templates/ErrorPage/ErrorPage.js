// @flow
import React, { Component } from 'react';

import Layout from '../Layout';
import HeadTag from '../../atoms/HeadTag';

class ErrorPage extends Component<any> {
  static getInitialProps({ res }: any) {
    if (res && res.redirect) {
      res.status(404);
    }
    return {};
  }

  render() {
    const { errorData } = this.props;
    const errorMessage = get(errorData, 'message');
    return (
      <Layout title="error" className="row" id="content-wrapper" tabindex="-1">
        <HeadTag description="error page" title="error page" />
        <section id="notFoundContent" style={{ width: '100%' }}>
          {errorMessage}
        </section>
      </Layout>
    );
  }
}

export default ErrorPage;
