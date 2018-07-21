'use strict';

const { getClient } = require('@spec/cli-tools/npm');
const addPlugin = require('@spec/cli-plugin-add');
const { loadPlugins, resolve: defaultResolve } = require('@spec/cli-plugins');
const cosmiconfig = require('cosmiconfig');
// const defaultResolve = require('./resolve');
const { defaultValidateConfig } = require('./validation');
const PluginAPI = require('./PluginAPI');
const DeferredWriteStore = require('./DeferredWriteStore');
const commands = require('./commands');

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
  const env = {
    cwd,
    npmClient: await getClient(cwd),
  };
  const api = new PluginAPI({
    store,
    defaultCommands: commands.map(command => command({ env, store })),
  });

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
  const defaultPlugins = [
    {
      name: '@spec/cli-plugin-add',
      options: {},
      plugin: addPlugin,
    },
  ];

  const plugins = await loadPlugins(config.plugins, resolve);
  // const plugins = await Promise.all(
  // config.plugins.map(descriptor => loadPlugin(descriptor, resolve))
  // );

  for (const { name, plugin, options } of defaultPlugins.concat(plugins)) {
    await plugin({
      api,
      options,
      env,
    });
  }

  return {
    name,
    filepath,
    plugins,
    api,
    store,
  };
}

// async function loadPlugin(descriptor, resolve) {
// const config = Array.isArray(descriptor) ? descriptor : [descriptor];
// const [name, options = {}] = config;

// console.log('Loading plugin:', name);

// const plugin = await resolve(name);

// return {
// name,
// plugin,
// options,
// };
// }

module.exports = load;
