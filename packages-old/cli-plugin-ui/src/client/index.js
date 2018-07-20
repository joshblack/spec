import './styles.scss';

import { AppContainer } from 'react-hot-loader';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './routes';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
  }),
  cache: new InMemoryCache(),
});

const mountNode = document.getElementById('root');
const render = (Component, callback) => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <ApolloProvider client={client}>{Component}</ApolloProvider>
      </BrowserRouter>
    </AppContainer>,
    mountNode,
    callback
  );
};

render(<App />);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextApp = require('./routes').default;
    render(<NextApp />);
  });
}
