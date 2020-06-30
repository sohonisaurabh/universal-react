import React from 'react';
import { Response } from 'express';

/* eslint-disable */
export default class CustomError extends React.Component {
  static getInitialProps({ res, pathname, err }: { res: Response; pathname: string; err: Error }) {
    try {
      const statusCode = res && res.statusCode > 200 ? res.statusCode : false;
      if (
        (statusCode || err) &&
        !(pathname.match('/webassets') || pathname.match('/api') || pathname.match('/static'))
      ) {
        if (res && res.redirect) {
          // return res.redirect(ERROR_PAGE);
        }

        // return Router.push(ERROR_PAGE);
      }

      return { statusCode };
    } catch (e) {
      // TODO: Handel Error safely
    }
    return {};
  }

  render() {
    return <div>Some Error Occured.</div>;
  }
}
