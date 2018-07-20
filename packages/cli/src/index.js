'use strict';

const { load } = require('@spec/cli-runtime');
const program = require('commander');
const packageJson = require('../package.json');
const addCommandToProgram = require('./addCommandToProgram');

async function main({ argv }) {
  const cwd = process.cwd();
  const { api } = await load(cwd);

  // prettier-ignore
  program
    .version(packageJson.version)
    .usage('<command> [options]');

  for (const command of api.commands) {
    addCommandToProgram(program, command);
  }

  program.parse(argv);
}

module.exports = main;
