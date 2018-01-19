'use strict';

const fs = require('fs-extra');
const packageJson = require('../../../package.json');

const CLI_NAME = Object.keys(packageJson.bin)[0];

const getScripts = (npmLink, useNpm) => {
  const npmClient = useNpm ? 'npm' : 'yarn';
  // If we're linking locally, set the path to resolve from the `examples`
  // directories so our scripts actually work.
  const command = npmLink
    ? `../packages/spec-cli/bin/${CLI_NAME}.js`
    : CLI_NAME;
  return {
    build: `${command} build`,
    'ci-check': `${npmClient} format:diff && ${npmClient} test --runInBand`,
    commitmsg: 'validate-commit-msg',
    dev: `${command} dev`,
    'dev:server': `${command} dev:server`,
    format: 'prettier --write "**/*.{scss,css,md,js,json}"',
    'format:diff': 'prettier --list-different "**/*.{scss,css,md,js,json}"',
    precommit: 'lint-staged',
    test: `${command} test`,
    start: `${command} start`,
  };
};

module.exports = program => {
  // eslint-disable-next-line import/no-dynamic-require
  const packageJson = require(program.cwd + '/package.json');

  if (packageJson.scripts === undefined) {
    packageJson.scripts = {};
  }

  packageJson.scripts = Object.assign(
    {},
    packageJson.scripts,
    getScripts(program.npmLink, program.useNpm)
  );

  packageJson.prettier = {
    jsxBracketSameLine: true,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'es5',
  };

  packageJson['lint-staged'] = {
    '*.js': ['prettier', 'git add'],
    '*.{css,scss,md,json}': ['prettier', 'git add'],
  };

  packageJson.config = {
    'validate-commit-msg': {
      helpMessage:
        // eslint-disable-next-line max-len
        '\nNeed help? We\'re currently using a commit convention that is outlined here:\nhttps://github.com/conventional-changelog/conventional-changelog/blob/v0.5.3/conventions/angular.md\n\nWe use this convention in order to make contributions to the project clear and predictable.\n\nCurrently, we support the following types: feat, fix, docs, style, refactor, perf, test, chore, revert.\n\nYou can use these types in your commit message in the following fashion:\n\n$ git commit -m "<type>(<scope>): some commit message here"',
    },
  };

  return fs.writeJson(program.cwd + '/package.json', packageJson, {
    spaces: 2,
  });
};
