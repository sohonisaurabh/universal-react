import React from 'react';

class OfflineSupport extends React.PureComponent {
  componentDidMount() {
    if ('serviceWorker' in navigator) {
      // eslint-disable-next-line compat/compat
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          // eslint-disable-next-line no-console
          console.log('service worker registration successful', registration);
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.warn('service worker registration failed', err.message);
        });
    }
  }

  render() {
    return null;
  }
}

export default OfflineSupport;
