import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

const PLUGINS_QUERY = gql`
  query getPlugins {
    plugins {
      name
      options {
        name
        value
      }
    }
  }
`;

const Plugins = () => (
  <section>
    <h1>Plugins</h1>
    <Query query={PLUGINS_QUERY}>
      {({ error, data }) => {
        if (error) {
          console.error(error);
          return 'Error';
        }

        if (data.plugins) {
          return (
            <ul>
              {data.plugins.map(plugin => (
                <li key={plugin.name}>
                  <p>{plugin.name}</p>
                  <pre>
                    <code>{JSON.stringify(plugin.options, null, 2)}</code>
                  </pre>
                </li>
              ))}
            </ul>
          );
        }

        return 'Loading';
      }}
    </Query>
  </section>
);

export default Plugins;
