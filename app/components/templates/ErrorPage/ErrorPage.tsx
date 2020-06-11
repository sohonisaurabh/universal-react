import React from 'react';
import { NextPage, NextPageContext } from 'next';
import get from 'lodash/get';

import Layout from '../Layout';
import enhance from '../../../lib/dynamicStore';
import initialActions from './ErrorPage.actions';
import HeadTag from '../../atoms/HeadTag';
import saga from './ErrorPage.saga';
import reducer from './ErrorPage.reducer';
import { Response } from 'express';

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

interface Context extends NextPageContext {
  res?: Response;
}

const ErrorPage: NextPage<Props> = props => {
  const { errorData } = props;
  const errorMessage = get(errorData, 'message');

  return (
    <Layout>
      <HeadTag description="error page" title="error page" />
      <section id="notFoundContent" style={{ width: '100%' }}>
        {errorMessage}
      </section>
    </Layout>
  );
};

ErrorPage.getInitialProps = ({ res }: Context): any => {
  if (res && res.redirect) {
    res.status(404);
  }
  return { statusCode: 404 };
};

/* istanbul ignore next */
const mapStateToProps = (state: State) => ({
  state,
  errorData: get(state, ['errorPage', 'errorPageData']),
});

export default enhance(ErrorPage as NextPage, {
  mapStateToProps,
  saga,
  reducer,
  key: 'errorPage',
  initialActions,
});

export { ErrorPage as ErrorPageDisconnected };
