'use strict';

const { createTransformer } = require('babel-jest');

const babelOptions = {
  presets: ['@spec/babel-preset-spec/test'],
};

module.exports = createTransformer(babelOptions);
