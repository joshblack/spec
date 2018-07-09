'use strict';

const cosmiconfig = require('cosmiconfig');
const { linkPlugin, loadPlugins } = require('./plugins');
const defaultResolve = require('./resolve');
const PluginAPI = require('./PluginAPI');

class Coordinator {
  constructor({
    name,
    cwd,
    program,
    logger,
    defaultPlugins = [],
    configLoader = cosmiconfig(name).search,
    resolve = defaultResolve,
  }) {
    this.name = name;
    this.cwd = cwd;
    this.program = program;

    this.api = new PluginAPI(logger);
    this.plugins = defaultPlugins;

    this._configLoader = configLoader;
    this._logger = logger;
    this._resolve = resolve;
    this._synced = false;
  }

  async sync() {
    this._logger.info('Syncing coordinator');

    if (this._synced) {
      return;
    }

    try {
      const remotePlugins = await loadPlugins(
        this._configLoader,
        this._resolve,
        this._logger
      );
      this.plugins = this.plugins.concat(remotePlugins);
    } catch (error) {
      console.error(error);
      return;
    }

    try {
      for (let { name, plugin, options } of this.plugins) {
        await plugin({
          api: this.api,
          Coordinator: this,
          cwd: this.cwd,
          options,
        });
      }
    } catch (error) {
      console.error(error);
      return;
    }

    this._synced = true;
  }

  async add(name) {
    this._logger.info(`Add plugin: ${name}`);
  }

  async addLocal(name) {
    this._logger.info(`Add local plugin: ${name}`);
    await linkPlugin(name, this._logger);
  }

  async cli() {
    this._logger.info('Loading cli');

    await this.sync();
    return await this.api.registerCommands(this.program);
  }
}

module.exports = Coordinator;
