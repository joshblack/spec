/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import type { Node } from 'react';

// TODO: Warn if `mountNode` === undefined
const mountNode = document.getElementById('root');

const render = (Component: Node, callback: () => void): void => {
  ReactDOM.render(
    <AppContainer>{Component}</AppContainer>,
    mountNode,
    callback
  );
};

const register = (
  RootComponent: Node,
  callback: () => void = () => {}
): void => {
  if (process.env.NODE_ENV === 'development') {
    require('react-axe')(React, ReactDOM, 1000);
  }

  // TODO: Warn if RootComponent is not a React Node
  render(RootComponent, callback);
};

export default register;
