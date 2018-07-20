import gql from 'graphql-tag';
import React from 'react';
import { css } from 'glamor';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

const PROJECT_QUERY = gql`
  query getProject {
    project {
      name
    }
  }
`;

const Header = () => (
  <header {...header}>
    <Query query={PROJECT_QUERY}>
      {({ data }) => {
        const content = data.project ? data.project.name : '';

        return <Link to="/">{content}</Link>;
      }}
    </Query>
  </header>
);

const header = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#ffffff',
  height: '3rem',
  padding: ' 0 2rem',
  borderBottom: '1px solid #252525',
});

export default Header;
