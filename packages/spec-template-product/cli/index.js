'use strict';

module.exports = program => {
  program
    .command('build')
    .description('build the project production assets')
    .action(() => {
      require('./build');
    });

  program
    .command('test')
    .description('run the project test runner')
    .action(() => {
      require('./test');
    });

  program
    .command('dev')
    .description('run the client development server')
    .action(() => {
      require('./dev');
    });

  program
    .command('dev:server')
    .description('run the server development process')
    .action(() => {
      require('./dev:server');
    });

  program
    .command('start')
    .description('run the production server process')
    .action(() => {
      require('./start');
    });

  return program;
};
