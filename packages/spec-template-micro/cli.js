'use strict';

module.exports = program => {
  program
    .command('test')
    .description('run the Jest test runner')
    .action(() => {
      console.log('testing...');
    });

  return program;
};
