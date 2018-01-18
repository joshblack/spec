#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description(packageJson.description)
  .command('build', 'build the static assets for your project')
  .alias('b')
  .command('dev', 'run the development server for client development')
  .command('dev:server', 'run a watch process for server development')
  .command('init', 'initialize the project')
  .alias('i')
  .command('start', 'start a production server process')
  .command('test', 'run tests through Jest')
  .alias('t')
  .command('format', 'format source files using prettier')
  .parse(process.argv);
