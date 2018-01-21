'use strict';

const path = require('path');
const cli = require('./cli');

module.exports = {
  name: 'micro',
  files: path.join(__dirname, 'files'),
  cli,
  packageJson: {
    name: ({ directory }) => directory,
    localDependencies: ['@spec/cli', '@spec/server'],
    dependencies: ['micro'],
    devDependencies: [],
    scripts: ({ npmClient, cliCommand }) => ({
      'ci-check': `${npmClient} format:diff && ${npmClient} test --runInBand`,
      format: 'prettier --write "**/*.{scss,css,md,js,json}"',
      'format:diff': 'prettier --list-different "**/*.{scss,css,md,js,json}"',
      start: 'micro',
      test: `${cliCommand} test`,
    }),
  },
};
