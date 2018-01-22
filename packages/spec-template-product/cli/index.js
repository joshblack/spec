'use strict';

module.exports = program => {
  program
    .command('build')
    .allowUnknownOption()
    .description('build the project production assets')
    .action(() => {
      require('./build');
    });

  program
    .command('test')
    .allowUnknownOption()
    .description('run the project test runner')
    .action(() => {
      require('./test');
    });

  program
    .command('dev')
    .allowUnknownOption()
    .description('run the client development server')
    .action(() => {
      require('./dev');
    });

  program
    .command('dev:server')
    .allowUnknownOption()
    .description('run the server development process')
    .action(() => {
      require('./dev:server');
    });

  program
    .command('start')
    .allowUnknownOption()
    .description('run the production server process')
    .action(() => {
      require('./start');
    });

  return program;
};
