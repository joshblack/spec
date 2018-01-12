'use strict';

process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const path = require('path');
const nodemon = require('nodemon');
const script = path.resolve(process.cwd(), 'src/server/index.js');

nodemon({ script });

let started = false;
const handleStart = () => {
  if (started) {
    return;
  }

  started = true;
  console.log(chalk.green('Watching files for changes...'));
};

const handleRestart = () => {
  console.log(chalk.yellow('Restarting process due to changes...'));
};

nodemon.on('start', handleStart).on('restart', handleRestart);
