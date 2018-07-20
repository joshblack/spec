'use strict';

const fs = require('fs-extra');
const {
  getClient,
  installDependencies,
  installDevDependencies,
  linkDependencies,
} = require('@spec/cli-tools/npm');
const {
  load,
  PluginAPI,
  resolve: defaultResolve,
} = require('@spec/cli-runtime');
const program = require('commander');
const path = require('path');
const packageJson = require('../package.json');

async function main({ argv }) {
  const cwd = process.cwd();

  // prettier-ignore
  program
    .version(packageJson.version)
    .usage('<command> [options]');

  const { api, store } = await load(cwd);

  const addCommand = {
    name: 'add <plugin-name>',
    description: 'add a plugin to your project',
    options: [
      {
        flags: '--link',
        description: 'link a local plugin to the project [DEV ONLY]',
      },
    ],
    async action(name, cmd) {
      console.log('Add plugin:', name, 'with options:', cmd);

      const localPackageJsonPath = path.join(cwd, 'package.json');
      const packageJson = await fs.readJson(localPackageJsonPath);
      const npmClient = await getClient(cwd);

      // TODO add support for ['plugin', {}] variant
      if (packageJson.spec.plugins.indexOf(name) !== -1) {
        throw new Error('plugin already exists');
      }

      packageJson.spec.plugins.push(name);

      await fs.writeJson(localPackageJsonPath, packageJson, {
        spaces: 2,
      });

      if (cmd.link) {
        await linkDependencies(npmClient, [name], {
          cwd,
        });
        const api = new PluginAPI({ store });
        const plugin = {
          name,
          options: {},
          plugin: await defaultResolve(name),
        };
        await plugin.plugin({
          api,
          options: plugin.options,
          env: {
            cwd,
          },
        });

        for (const thunk of api.thunks.add) {
          await thunk({
            async addDependencies(dependencies) {
              const deps = dependencies
                .filter(
                  ({ type, useLink }) => type === 'dependency' && !useLink
                )
                .reduce((acc, dependency) => {
                  return acc.concat(dependency.pkg);
                }, []);

              if (deps.length > 0) {
                await installDependencies(npmClient, deps, {
                  cwd,
                });
              }

              const links = dependencies
                .filter(({ useLink }) => useLink)
                .reduce((acc, dependency) => {
                  return acc.concat(dependency.pkg);
                }, []);

              if (links.length > 0) {
                await linkDependencies(npmClient, links, {
                  cwd,
                });
              }

              const devDependencies = dependencies
                .filter(
                  ({ type, useLink }) => type === 'devDependency' && !useLink
                )
                .reduce((acc, dependency) => {
                  return acc.concat(dependency.pkg);
                }, []);

              if (devDependencies.length > 0) {
                await installDevDependencies(npmClient, devDependencies, {
                  cwd,
                });
              }
            },

            addPlugins(plugins) {
              const { spec } = packageJson;
              const installedPlugins = spec.plugins.filter(descriptor => {
                if (Array.isArray(descriptor)) {
                  return descriptor[0];
                }
                return descriptor;
              });
              const pluginsToAdd = plugins.filter(plugin => {
                return installedPlugins.indexOf(plugin) === -1;
              });
              const nextPackageJson = Object.assign({}, packageJson);
              nextPackageJson.spec = {
                plugins: [...nextPackageJson.spec.plugins, ...pluginsToAdd],
              };

              return fs.writeJson(localPackageJsonPath, nextPackageJson, {
                spaces: 2,
              });
            },

            copy(filepaths) {
              console.log('Copying:', filepaths, 'to:', cwd);
              return Promise.all(
                filepaths.map(filepath => fs.copy(filepath, cwd))
              );
            },

            async extendPackageJson(updater) {
              const packageJson = await fs.readJson(localPackageJsonPath);
              const file = Object.assign(
                {},
                packageJson,
                updater({
                  npmClient,
                  cliPath: path.resolve(__dirname, '../bin/index.js'),
                  packageJson,
                })
              );

              await fs.writeJson(localPackageJsonPath, file, {
                spaces: 2,
              });
            },
          });
        }
        return;
      }

      throw new Error('Not implemented');
    },
  };
  const commands = [addCommand, ...api.commands];

  for (const command of commands) {
    addCommandToProgram(program, command);
  }

  program.parse(argv);
}

function addCommandToProgram(program, command) {
  const { name, description, options = [], action } = command;
  const cliCommand = program.command(name).description(description);

  for (let option of options) {
    const { flags, description, defaults } = option;
    const args = [flags, description, defaults].filter(Boolean);
    cliCommand.option(...args);
  }

  cliCommand.action((...args) => {
    const commandArgs = args.slice(args, args.length - 1);
    const command = args[args.length - 1];
    try {
      return action(...commandArgs, cleanArgs(command));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
}

// Copied from Vue CLI:
// https://github.com/vuejs/vue-cli/blob/31e1b4995edef3d2079da654deedffe002a1d689/packages/%40vue/cli/bin/vue.js#L172
function cleanArgs(command) {
  return command.options.reduce((acc, option) => {
    // Add case for mapping `--foo-bar` to `fooBar`
    const key = option.long
      .replace(/^--/, '')
      .split('-')
      .map((word, i) => {
        if (i === 0) {
          return word;
        }
        return word[0].toUpperCase() + word.slice(1);
      })
      .join('');

    // If an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof command[key] !== 'function') {
      return {
        ...acc,
        [key]: command[key],
      };
    }
    return acc;
  }, {});
}

// //------------------------------------------------------------------------------
// // Configuration validation
// //------------------------------------------------------------------------------
// const Joi = require('joi');

// // Definitely a great candidate for table-driven tests to make sure that this
// // will validate the situations that we're looking for.
// const configSchema = Joi.object()
// .keys({
// plugins: Joi.array()
// .items(
// Joi.string(),
// Joi.array()
// .min(1)
// .max(2)
// .ordered(Joi.string().required(), Joi.object())
// )
// .required(),
// })
// .required();

/**
 * @param {Object} config The configuration to validate
 * @returns {Object} The result of the validation. Should have the shape:
 * type ValidationResult = {
 *   error?: ValidationError,
 *   value?: Config
 * };
 */
// function defaultValidateConfig(config) {
// return Joi.validate(config, configSchema);
// }

// const commandSchema = Joi.object()
// .keys({
// name: Joi.string().required(),
// description: Joi.string().required(),
// options: Joi.array().items(
// Joi.object().keys({
// flags: Joi.string().required(),
// description: Joi.string().required(),
// defaults: Joi.string(),
// })
// ),
// action: Joi.func().required(),
// })
// .required();

// function defaultValidateCommand(config) {
// return Joi.validate(config, commandSchema);
// }

// //------------------------------------------------------------------------------
// // Resolve method
// //------------------------------------------------------------------------------
// const path = require('path');

/**
 * @param {string} string The path to resolve
 * @returns {Function | Object} The module that is required
 */
// async function defaultResolve(string) {
// if (isPathString(string)) {
// const source = path.resolve(string);
// return require(source);
// }
// return require(string);
// }

// function isPathString(string) {
// return string[0] === '.' || string[0] === '/';
// }

// //------------------------------------------------------------------------------
// // Config
// //------------------------------------------------------------------------------
// const cosmiconfig = require('cosmiconfig');

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
// function defaultLoader(name, cwd) {
// return cosmiconfig(name, { stopDir: cwd }).search();
// }

// async function load(
// cwd = process.cwd(),
// {
// name = 'spec',
// loader = defaultLoader,
// validate = defaultValidateConfig,
// resolve = defaultResolve,
// } = {}
// ) {
// console.log('Loading config');

// const result = await loader(name, cwd);
// if (result === null) {
// // console.log(`No configuration found for the directory: ${cwd}`);
// return null;
// }

// const { config, filepath, isEmpty } = result;
// const { error } = validate(config);
// if (error) {
// // console.log(error);
// throw error;
// }

// console.log('Loading plugins');

// const plugins = await Promise.all(
// config.plugins.map(descriptor => loadPlugin(descriptor, resolve))
// );
// const store = new DeferredWriteStore();
// const api = new PluginAPI({ store });

// for (const { name, plugin, options } of plugins) {
// console.log('Initializing plugin:', name);

// await plugin({
// api,
// options,
// env: {
// cwd,
// },
// });
// }

// return {
// name,
// filepath,
// plugins,
// api,
// store,
// };
// }

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

// //------------------------------------------------------------------------------
// // Plugin API
// //------------------------------------------------------------------------------
// class PluginAPI {
// constructor({
// store,
// defaultCommands = [],
// validateCommand = defaultValidateCommand,
// }) {
// this.commands = [];
// this.thunks = {
// add: [],
// };
// this.store = store;
// this.validateCommand = validateCommand;

// for (const command of defaultCommands) {
// this.addCommand(command);
// }
// }

// // Store proxy methods
// read(...args) {
// return this.store.read(...args);
// }

// extend(...args) {
// return this.store.write(...args);
// }

// // Command-related methods
// addCommand(command) {
// const { error } = this.validateCommand(command);
// if (error) {
// throw error;
// }
// this.commands.push(command);
// }

// add(thunk) {
// this.thunks.add.push(thunk);
// }
// }

// //------------------------------------------------------------------------------
// // DW Store
// //------------------------------------------------------------------------------
// const get = require('lodash.get');
// const set = require('lodash.set');

// class DeferredWriteStore {
// constructor() {
// this._store = {};
// this._writers = {};
// }

// async read(path) {
// const entry = get(this._store, path);
// const writers = this._writers[path];

// if (entry && isEqual(entry.writers, writers)) {
// return entry.value;
// }

// // Initialize default value to an empty object
// let value = {};

// if (Array.isArray(this._writers[path])) {
// for (const writer of this._writers[path]) {
// value = await writer(value);
// }
// }

// set(this._store, path, {
// value,
// // Shallow clone of array so that array reference is not identical, but
// // the writer references are so we can compare them in a subsequent read
// writers: writers.slice(),
// });

// return value;
// }

// write(path, writer) {
// if (!Array.isArray(this._writers[path])) {
// this._writers[path] = [writer];
// return;
// }

// this._writers[path].push(writer);
// }
// }

/**
 * Shallow equality comparison for two arrays
 * @param {Array[any]} collectionA
 * @param {Array[any]} collectionB
 * @return boolean
 */
// function isEqual(collectionA, collectionB) {
// if (collectionA.length !== collectionB.length) {
// return false;
// }

// for (let i = 0; i < collectionA.length; i++) {
// if (collectionA[i] !== collectionB[i]) {
// return false;
// }
// }

// return true;
// }

module.exports = main;
