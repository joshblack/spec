'use strict';

// const cosmiconfig = require('cosmiconfig');
// const { Config } = require('@spec/cli-config');
// const { getClient } = require('@spec/cli-tools/npm');
// const { linkPlugin, loadPlugins } = require('./plugins');
// const defaultResolve = require('./resolve');
// const PluginAPI = require('./PluginAPI');

class Coordinator {
  constructor({
    name,
    cwd,
    program,
    logger,
    defaultPlugins = [],
    // configLoader = cosmiconfig(name).search,
    // resolve = defaultResolve,
  }) {
    this.name = name;
    this.cwd = cwd;
    this.program = program;

    // this.api = new PluginAPI(logger);
    this.plugins = defaultPlugins;

    // this._configLoader = configLoader;
    this._logger = logger;
    // this._resolve = resolve;
    this._synced = false;
  }

  // async add(name, { local }) {
  // // Install locally as a dependency
  // // Add plugin to Coordinator
  // this._logger.info(`Add plugin: ${name}`);

  // if (local) {
  // console.log('hihihihi');
  // return;
  // // await linkPlugin(name, this.cwd, this._logger);
  // }

  // throw new Error('Not implemented for remote plugins');
  // }

  async cli() {
    this._logger.info('Loading cli');

    await this.sync();
    return this.program;
    // // return await this.api.registerCommands(this.program);
  }

  async sync() {
    this._logger.info('Syncing coordinator');

    if (this._synced) {
      return;
    }

    // const config = await Config.search('spec');
    // try {
    // const remotePlugins = await loadPlugins(
    // this._configLoader,
    // this._resolve,
    // this._logger
    // );
    // this.plugins = this.plugins.concat(remotePlugins);
    // } catch (error) {
    // console.error(error);
    // return;
    // }
    // const env = {
    // cwd: this.cwd,
    // npmClient: await getClient(this.cwd),
    // };
    // for (let { name, plugin, options } of this.plugins) {
    // await plugin({
    // api: this.api,
    // env,
    // options,
    // });
    // }

    this._synced = true;
  }
}

module.exports = Coordinator;
