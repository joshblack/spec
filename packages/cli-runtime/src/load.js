'use strict';

const { getClient } = require('@spec/cli-tools/npm');
const addPlugin = require('@spec/cli-plugin-add');
const createPlugin = require('@spec/cli-plugin-create');
const { loadPlugins, resolve: defaultResolve } = require('@spec/cli-plugins');
const cosmiconfig = require('cosmiconfig');
const { defaultValidateConfig } = require('./validation');
const PluginAPI = require('./PluginAPI');
const DeferredWriteStore = require('./DeferredWriteStore');

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

async function load(
  cwd = process.cwd(),
  {
    name = 'spec',
    loader = defaultLoader,
    validate = defaultValidateConfig,
    resolve = defaultResolve,
  } = {}
) {
  console.log('Loading config');

  const store = new DeferredWriteStore();
  const api = new PluginAPI({
    store,
  });
  const env = {
    cwd,
    npmClient: await getClient(cwd),
  };
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
  ];

  await applyPlugins(defaultPlugins, api, env);

  const result = await loader(name, cwd);
  if (result === null) {
    console.log(`No configuration found for the directory: ${cwd}`);
    return {
      name,
      api,
      store,
    };
  }

  const { config, filepath, isEmpty } = result;
  const { error } = validate(config);
  if (error) {
    // console.log(error);
    throw error;
  }

  console.log('Loading plugins');

  const plugins = await loadPlugins(config.plugins, resolve);

  await applyPlugins(plugins, api, env);

  return {
    name,
    filepath,
    plugins,
    api,
    store,
  };
}

async function applyPlugins(plugins, api, env) {
  for (const { name, plugin, options } of plugins) {
    await plugin({
      api,
      options,
      env,
    });
  }
}

module.exports = load;