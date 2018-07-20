'use strict';

const cleanArgs = require('./cleanArgs');

function addCommandToProgram(program, command) {
  const { name, description, options = [], action } = command;
  const cliCommand = program.command(name).description(description);

  for (let option of options) {
    const { flags, description, defaults } = option;
    const args = [flags, description, defaults].filter(Boolean);
    cliCommand.option(...args);
  }

  cliCommand.action((...args) => {
    const commandArgs = args.slice(args, args.length - 1);
    const command = args[args.length - 1];
    try {
      return action(...commandArgs, cleanArgs(command));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
}

module.exports = addCommandToProgram;
