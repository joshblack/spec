'use strict';

const path = require('path');
const jest = require('jest');
const merge = require('lodash.merge');
const createJestConfig = require('./tools/createJestConfig');

function test(args, localConfig = {}) {
  const jestConfig = merge(createJestConfig(), localConfig);
  args.push('--config', JSON.stringify(jestConfig));
  return jest.run(args);
}

module.exports = test;
