import React, { Component } from 'react';
import get from 'lodash/get';

import Layout from '../Layout';
import enhance from '../../../lib/dynamicStore';
import initialActions from './ErrorPage.actions';
import HeadTag from '../../atoms/HeadTag';
import saga from './ErrorPage.saga';
import reducer from './ErrorPage.reducer';

type State = {
  errorPage: {
    errorData: object;
  };
};

type Props = {
  errorData: {
    message: string;
  };
};

class ErrorPage extends Component<Props, State> {
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
      <Layout>
        <HeadTag description="error page" title="error page" />
        <section id="notFoundContent" style={{ width: '100%' }}>
          {errorMessage}
        </section>
      </Layout>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = (state: State) => ({
  state,
  errorData: get(state, ['errorPage', 'errorPageData']),
});

export default enhance(ErrorPage, {
  mapStateToProps,
  saga,
  reducer,
  key: 'errorPage',
  initialActions,
});

export { ErrorPage as ErrorPageDisconnected };
