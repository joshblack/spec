import './styles/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const mountNode = document.getElementById('root');
const render = (Component: Node, callback: () => void): void => {
  ReactDOM.render(
    <AppContainer>{Component}</AppContainer>,
    mountNode,
    callback
  );
};

render(<App />);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    render(<NextApp />);
  });
}
