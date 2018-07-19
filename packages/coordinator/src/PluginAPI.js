'use strict';

const get = require('lodash.get');
const set = require('lodash.set');
const DeferredWriteStore = require('./DeferredWriteStore');
const cleanArgs = require('./cleanArgs');

class PluginAPI {
  // constructor(logger, initialCommands = []) {
  // this._add = [];
  // this.commands = initialCommands;
  // this.store = new DeferredWriteStore();
  // this._logger = logger;
  // }
  // addCommand(command) {
  // this.commands.push(command);
  // }
  // registerCommands(program) {
  // this._logger.info('Registering commands');
  // for (const command of this.commands) {
  // this.registerCommand(program, command);
  // }
  // return program;
  // }
  // registerCommand(program, command) {
  // this._logger.info('Registering command:', command.name);
  // const { name, description, options = [], action } = command;
  // const cliCommand = program.command(name).description(description);
  // for (let option of options) {
  // const { flags, description, defaults } = option;
  // const args = [flags, description, defaults].filter(Boolean);
  // cliCommand.option(...args);
  // }
  // cliCommand.action((...args) => {
  // const commandArgs = args.slice(args, args.length - 1);
  // const command = args[args.length - 1];
  // try {
  // return action(...commandArgs, cleanArgs(command));
  // } catch (error) {
  // console.error(error);
  // process.exit(1);
  // }
  // });
  // }
  // extend(...args) {
  // return this.store.write(...args);
  // }
  // read(...args) {
  // return this.store.read(...args);
  // }
  // add(thunk) {
  // this._add.push(thunk);
  // }
  // async install(name) {
  // this._logger.info(`Installing plugin: ${name}`);
  // for (const thunk of this._add) {
  // await thunk();
  // }
  // }
}

module.exports = PluginAPI;
