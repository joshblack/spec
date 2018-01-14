'use strict';

const fs = require('fs-extra');
const packageJson = require('../../../package.json');

const CLI_NAME = Object.keys(packageJson.bin)[0];

const getScripts = npmLink => {
  // If we're linking locally, set the path to resolve from the `examples`
  // directories so our scripts actually work.
  const command = npmLink
    ? `../../packages/spec-cli/bin/${CLI_NAME}.js`
    : CLI_NAME;
  return {
    build: `${command} build`,
    dev: `${command} dev`,
    'dev:server': `${command} dev:server`,
    test: `${command} test`,
    start: `${command} start`,
  };
};

module.exports = program => {
  const packageJson = require(program.cwd + '/package.json');
  if (packageJson.scripts === undefined) {
    packageJson.scripts = {};
  }
  packageJson.scripts = Object.assign(
    {},
    packageJson.scripts,
    getScripts(program.npmLink)
  );
  return fs.writeJson(program.cwd + '/package.json', packageJson, {
    spaces: 2,
  });
};
