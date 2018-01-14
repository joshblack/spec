'use strict';

const program = require('commander');
const init = require('../scripts/init');

program
  .description('Scaffold out your application structure.')
  .option(
    '-t, --template [template]',
    'Specify a specific template [default]',
    'default'
  )
  .option(
    '--npmClient [npmClient]',
    'Specify a client to use to installd dependencies [npm,yarnpkg]',
    'yarnpkg'
  )
  .option('--npmLink', 'Used for local development to link npm packages', false)
  .parse(process.argv);

program.cwd = process.cwd();
init(program);
