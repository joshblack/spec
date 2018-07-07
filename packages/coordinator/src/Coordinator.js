'use strict';

const cosmiconfig = require('cosmiconfig');
const { loadPlugins } = require('./plugins');
const defaultResolve = require('./resolve');
const PluginAPI = require('./PluginAPI');

class Coordinator {
  constructor(name, cwd, program, configLoader, resolve) {
    this.name = name;
    this.cwd = cwd;
    this.program = program;

    this.api = new PluginAPI();

    this._configLoader = configLoader || cosmiconfig(name).search;
    this._resolve = resolve || defaultResolve;
    this._synced = false;
  }

  async sync() {
    console.log('Syncing...');

    if (this._synced) {
      return true;
    }

    this.plugins = await loadPlugins(this._configLoader, this._resolve);

    for (let { name, plugin, options } of this.plugins) {
      await plugin({ api: this.api, cwd: this.cwd, options });
    }

    this._synced = true;
  }

  async cli() {
    console.log('Loading cli...');
    await this.sync();
    return await this.api.registerCommands(this.program);
  }
}

module.exports = Coordinator;
