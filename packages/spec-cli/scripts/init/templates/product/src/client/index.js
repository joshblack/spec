import './styles/styles.scss';

import React from 'react';
import register from '@ocelot/client/lib/register';
import App from './components/App';

register(<App />, () => {
  console.log('callback!');
});

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    register(<NextApp />, () => {
      console.log('HMR!');
    });
  });
}
