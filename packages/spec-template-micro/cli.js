'use strict';

module.exports = program => {
  program
    .command('test')
    .description('run the Jest test runner')
    .action(() => {
      // eslint-disable-next-line no-console
      console.log('testing...');
    });

  return program;
};
