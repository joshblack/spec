'use strict';

const chalk = require('chalk');

module.exports = program => {
  const useYarn = program.npmClient === 'yarnpkg';
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success!`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run'} dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), program.cwd);
  console.log(`  ${chalk.cyan(`${displayedCommand} dev`)}`);
  console.log();
  console.log('Happy hacking!');
};
