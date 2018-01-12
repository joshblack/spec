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
  .parse(process.argv);

program.cwd = process.cwd();
init(program);
