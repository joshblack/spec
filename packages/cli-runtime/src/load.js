'use strict';

const { createLogger } = require('@spec/cli-logger');
const { getClient } = require('@spec/cli-tools/npm');
const addPlugin = require('@spec/cli-plugin-add');
const createPlugin = require('@spec/cli-plugin-create');
const {
  loadConfig,
  loadPresets,
  loadPlugins,
  resolve: defaultResolve,
} = require('@spec/cli-plugins');
const cosmiconfig = require('cosmiconfig');
const { defaultValidateConfig } = require('./validation');
const PluginAPI = require('./PluginAPI');
const DeferredWriteStore = require('./DeferredWriteStore');

const defaultPlugins = [
  {
    name: '@spec/cli-plugin-add',
    options: {},
    plugin: addPlugin,
  },
  {
    name: '@spec/cli-plugin-create',
    options: {},
    plugin: createPlugin,
  },
  {
    name: '@spec/cli-plugin-env',
    options: {},
    plugin: require('@spec/cli-plugin-env'),
  },
  {
    name: '@spec/cli-plugin-paths',
    options: {},
    plugin: require('@spec/cli-plugin-paths'),
  },
];
const logger = createLogger('@spec/cli-runtime');

async function load(
  cwd = process.cwd(),
  {
    name = 'spec',
    loader = defaultLoader,
    validate = defaultValidateConfig,
    resolve = defaultResolve,
  } = {}
) {
  logger.trace('Loading runtime configuration');

  const store = new DeferredWriteStore();
  const api = new PluginAPI({
    store,
  });
  const env = {
    cwd,
    npmClient: await getClient(cwd),
  };

  logger.trace('Loading default plugins');

  await applyPlugins(defaultPlugins, api, env);

  const result = await loader(name, cwd);
  if (result === null) {
    logger.debug(`No configuration found for the directory: ${cwd}`);
    return {
      name,
      api,
      store,
    };
  }

  const { config: rawConfig, filepath, isEmpty } = result;
  const { error } = validate(rawConfig);
  if (error) {
    logger.error(error);
    throw error;
  }

  logger.trace('Loading plugins from configuration');

  const plugins = await loadConfig(normalize(rawConfig));
  // console.log(plugins)

  return {
    name,
    filepath,
    api,
    store,
  };

  // const plugins = await loadPlugins(config.plugins, resolve);

  // await applyPlugins(plugins, api, env);

  // return {
  // name,
  // filepath,
  // plugins,
  // api,
  // store,
  // };
}

function normalize(config) {
  return {
    presets: [],
    plugins: [],
    ...config,
  };
}

async function applyPlugins(plugins, api, env) {
  for (const { name, plugin, options } of plugins) {
    logger.trace(`Applying plugin: ${name}`);
    await plugin({
      api,
      options,
      env,
    });
  }
}

/**
 * type Result = {
 *  config: {
 *    plugins: Array<string | PluginConfig>
 *  },
 *  filepath: string,
 * };
 *
 * type PluginConfig = [string, { [key: string]: any }]
 */

/**
 * @param {string} name The name of your module
 * @param {string} cwd The current directory of the process
 */
function defaultLoader(name, cwd) {
  return cosmiconfig(name, { stopDir: cwd }).search();
}

module.exports = load;
