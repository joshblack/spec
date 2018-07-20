'use strict';

// const { createLogger } = require('@spec/cli-tools/logger');
// const cosmiconfig = require('cosmiconfig');
// const Joi = require('joi');
// const { loadPlugins } = require('./load');
// const resolve = require('./resolve');
// const schema = require('./schema');

// const logger = createLogger('@spec/cli-config');
// const validate = config => Joi.validate(config, schema);

class Config {
  static async search(name) {
    console.log('Searching');
    return new Config();
    // const loader = cosmiconfig(name).search;
    // const plugins = await loadPlugins(loader, resolve, validate, logger);
    // return new Config();
  }

  constructor() {}
}

// const logger = createLogger('Config');
// const validate = config => Joi.validate(config, schema);

// class Config {
// static async search(
// root,
// name,
// { loader = cosmiconfig(name).search, logger = createLogger('Config') } = {}
// ) {
// const config = await loadPlugins(loader, resolve, validate, logger);

// return new Config({
// config,
// root,
// loader,
// logger,
// resolve,
// validate,
// });
// }

// static async load(root, name) {
// // ...
// return new Config({});
// }

// constructor({ config, root, loader, logger, resolve, validate }) {
// this.config = config;
// this.root = root;

// this._loader = loader;
// this._logger = logger;
// this._resolve = resolve;
// this._validate = validate;
// }

// addPlugin(name) {}

// hasPlugin(name) {}

// removePlugin(name) {}
// }

module.exports = Config;
