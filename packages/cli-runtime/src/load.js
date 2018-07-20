'use strict';

const cosmiconfig = require('cosmiconfig');
const defaultResolve = require('./resolve');
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

  const result = await loader(name, cwd);
  if (result === null) {
    // console.log(`No configuration found for the directory: ${cwd}`);
    return null;
  }

  const { config, filepath, isEmpty } = result;
  const { error } = validate(config);
  if (error) {
    // console.log(error);
    throw error;
  }

  console.log('Loading plugins');

  const plugins = await Promise.all(
    config.plugins.map(descriptor => loadPlugin(descriptor, resolve))
  );
  const store = new DeferredWriteStore();
  const env = {
    cwd,
  };
  const api = new PluginAPI({
    store,
    defaultCommands: commands.map(command => command({ env, store })),
  });

  for (const { name, plugin, options } of plugins) {
    await plugin({
      api,
      options,
      env: {
        cwd,
      },
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

async function loadPlugin(descriptor, resolve) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;

  console.log('Loading plugin:', name);

  const plugin = await resolve(name);

  return {
    name,
    plugin,
    options,
  };
}

module.exports = load;
