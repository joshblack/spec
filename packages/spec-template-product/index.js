'use strict';

const path = require('path');
const cli = require('./cli');

module.exports = {
  // Template name
  name: 'product',
  files: path.join(__dirname, 'files'),
  cli,
  // `package.json` to be added to the template
  packageJson: {
    name: ({ directory }) => directory,
    localDependencies: ['@spec/cli', '@spec/server'],
    dependencies: ['react', 'react-dom', 'prop-types', 'express'],
    devDependencies: [
      'prettier',
      'husky',
      'lint-staged',
      'validate-commit-msg',
      'eslint',
      'babel-eslint',
      'eslint-config-spec',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'react-hot-loader',
      'enzyme',
      'enzyme-to-json',
    ],

    scripts: ({ npmClient, cliCommand }) => ({
      build: `${cliCommand} build`,
      'ci-check': `${npmClient} format:diff && ${npmClient} test --runInBand`,
      commitmsg: 'validate-commit-msg',
      dev: `${cliCommand} dev`,
      'dev:server': `${cliCommand} dev:server`,
      format: 'prettier --write "**/*.{scss,css,md,js,json}"',
      'format:diff': 'prettier --list-different "**/*.{scss,css,md,js,json}"',
      lint: 'eslint -c spec src',
      precommit: 'lint-staged',
      test: `${cliCommand} test`,
      start: `${cliCommand} start`,
    }),
  },
};
