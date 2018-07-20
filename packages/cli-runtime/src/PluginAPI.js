'use strict';

const { defaultValidateCommand } = require('./validation');

class PluginAPI {
  constructor({
    store,
    defaultCommands = [],
    validateCommand = defaultValidateCommand,
  }) {
    this.commands = [];
    this.thunks = {
      add: [],
    };
    this.store = store;
    this.validateCommand = validateCommand;

    for (const command of defaultCommands) {
      this.addCommand(command);
    }
  }

  // Store proxy methods
  read(...args) {
    return this.store.read(...args);
  }

  extend(...args) {
    return this.store.write(...args);
  }

  // Command-related methods
  addCommand(command) {
    const { error } = this.validateCommand(command);
    if (error) {
      throw error;
    }
    this.commands.push(command);
  }

  add(thunk) {
    this.thunks.add.push(thunk);
  }
}

module.exports = PluginAPI;
