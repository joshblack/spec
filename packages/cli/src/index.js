'use strict';

const { logger } = require('@spec/cli-logger');
const { load } = require('@spec/cli-runtime');
const program = require('commander');
const packageJson = require('../package.json');
const addCommandToProgram = require('./addCommandToProgram');

const cwd = process.cwd();

async function main({ argv }) {
  logger.trace(`Loading CLI for ${cwd}`);

  const { api } = await load(cwd);

  // prettier-ignore
  program
    .version(packageJson.version)
    .usage('<command> [options]');

  for (const command of api.commands) {
    logger.trace(`Adding command ${command.name} to program`);
    addCommandToProgram(program, command);
  }

  program.parse(argv);
}

module.exports = main;
