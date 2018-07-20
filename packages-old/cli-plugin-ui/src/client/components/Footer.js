import gql from 'graphql-tag';
import React from 'react';
import { css } from 'glamor';
import { Query } from 'react-apollo';

import Debug from '@ibmduo/icons-react/lib/debug/16';
import Folder from '@ibmduo/icons-react/lib/folder/16';
import GitHub from '@ibmduo/icons-react/lib/github/20.js';

const PROJECT_QUERY = gql`
  query getProject {
    project {
      relative
    }
  }
`;

const Footer = () => (
  <footer {...footer}>
    <div {...container}>
      <a href="https://ibm.com" {...company}>
        IBM
      </a>
      <Query query={PROJECT_QUERY}>
        {({ data }) => {
          const relative = data.project ? data.project.relative : '';
          return (
            <div {...container}>
              <Folder {...css(icon, folder)} />
              ~/{relative}
            </div>
          );
        }}
      </Query>
    </div>
    <div {...container}>
      <a href="https://github.com" title="Go to our GitHub">
        <GitHub {...icon} />
      </a>
      <Debug {...icon} />
    </div>
  </footer>
);

const container = css({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});

const company = css({
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#ffffff',
  textDecoration: 'none',
  marginRight: '2rem',
});

const icon = css({
  fill: '#ffffff',
});

const folder = css({
  marginRight: '0.5rem',
});

const footer = css({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#252525',
  color: '#F3F3F3',
  fontSize: '10px',
  padding: '0 0.5rem',
  height: '2rem',
});

export default Footer;
