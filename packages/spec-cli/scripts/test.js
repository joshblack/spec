'use strict';

const path = require('path');
const jest = require('jest');
const createJestConfig = require('./tools/createJestConfig');

function test(args) {
  args.push(
    '--config',
    JSON.stringify(
      createJestConfig(relativePath =>
        path.resolve(__dirname, '..', relativePath)
      )
    )
  );

  return jest.run(args);
}

module.exports = test;
