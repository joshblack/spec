'use strict';

const { Coordinator } = require('@spec/coordinator');
const packageJson = require('./package.json');

async function main({ argv }) {
  const cli = await Coordinator.cli();

  // prettier-ignore
  cli
    .version(packageJson.version)
    .usage('<command> [options]');

  cli.parse(argv);
}

module.exports = main;
