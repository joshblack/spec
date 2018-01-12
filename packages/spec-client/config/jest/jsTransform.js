'use strict';

const path = require('path');
const { createTransformer } = require('babel-jest');

const babelOptions = {
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    'stage-2',
    'react',
  ],
  plugins: ['transform-async-generator-functions', 'syntax-dynamic-import'],
  env: {
    test: {
      plugins: ['dynamic-import-node'],
    },
  },
};

module.exports = createTransformer(babelOptions);
