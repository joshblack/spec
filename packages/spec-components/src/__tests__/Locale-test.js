/* @noflow */

import React from 'react';
import renderer from 'react-test-renderer';
import Locale from '../Locale';

describe('Locale component', () => {
  it('should render', done => {
    const tree = renderer.create(
      <Locale
        language="en"
        locale="en-US"
        loadMessages={() =>
          Promise.resolve({
            greeting: 'hello',
          })}
        render={(error, isLoading) => {
          if (isLoading) {
            return <p>Loading...</p>;
          }

          if (error) {
            return <p>Error</p>;
          }

          return <h1>Hi there</h1>;
        }}
      />
    );

    setTimeout(() => {
      expect(tree.toJSON()).toMatchSnapshot();
      done();
    });
  });
});
