'use strict';

const get = require('lodash.get');
const set = require('lodash.set');
const DeferredWriteStore = require('./DeferredWriteStore');

class PluginAPI {
  constructor(initialCommands = []) {
    this.commands = initialCommands;
    this.store = new DeferredWriteStore();
  }

  addCommand(command) {
    this.commands.push(command);
  }

  async registerCommands(program) {
    console.log('Registering commands');

    for (const command of this.commands) {
      const { name, description, action } = command;
      console.log('Registering command:', name);
      program
        .command(name)
        .description(description)
        .action(action);
    }

    return program;
  }

  extend(...args) {
    return this.store.write(...args);
  }

  read(...args) {
    return this.store.read(...args);
  }
}

module.exports = PluginAPI;
