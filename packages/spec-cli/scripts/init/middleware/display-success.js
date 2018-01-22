'use strict';

/* eslint-disable no-console */

const chalk = require('chalk');
const path = require('path');

module.exports = program => {
  const { useNpm } = program;
  const displayedCommand = useNpm ? 'npm' : 'yarn';

  console.log();
  console.log(chalk.green('Success!'));
  console.log();
  console.log(`${chalk.cyan('@spec/cli')} just created your project at:`);
  console.log(`  ${program.cwd}`);
  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand}${useNpm ? ' run' : ''} dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} ${useNpm ? 'run ' : ''}build`));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(
    `  ${chalk.cyan(`cd ${path.relative(process.cwd(), program.cwd)}`)}`
  );
  console.log(`  ${chalk.cyan(`${displayedCommand} dev`)}`);
  console.log();
  console.log('Happy hacking!');
};
