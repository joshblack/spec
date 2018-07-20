'use strict';

const {
  getClient,
  installDependencies,
  installDevDependencies,
  linkDependencies,
} = require('@spec/cli-tools/npm');
const fs = require('fs-extra');
const path = require('path');
const PluginAPI = require('../PluginAPI');
const defaultResolve = require('../resolve');

module.exports = ({ env, store }) => ({
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

    // TODO: should we derive t his from the store value for paths?
    const localPackageJsonPath = path.join(env.cwd, 'package.json');
    const getPackageJson = () => {
      return fs.readJson(localPackageJsonPath);
    };
    const writePackageJson = packageJson => {
      return fs.writeJson(localPackageJsonPath, packageJson, {
        spaces: 2,
      });
    };

    const npmClient = await getClient(env.cwd);
    const packageJson = await getPackageJson();

    // TODO add support for ['plugin', {}] variant
    if (packageJson.spec.plugins.indexOf(name) !== -1) {
      throw new Error('plugin already exists');
    }

    packageJson.spec.plugins.push(name);
    await writePackageJson(packageJson);

    if (cmd.link) {
      await linkDependencies(npmClient, [name], {
        cwd: env.cwd,
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
        env,
      });

      for (const thunk of api.thunks.add) {
        await thunk({
          async addDependencies(dependencies) {
            const deps = dependencies
              .filter(({ type, useLink }) => type === 'dependency' && !useLink)
              .reduce((acc, dependency) => {
                return acc.concat(dependency.pkg);
              }, []);

            if (deps.length > 0) {
              await installDependencies(npmClient, deps, {
                cwd: env.cwd,
              });
            }

            const links = dependencies
              .filter(({ useLink }) => useLink)
              .reduce((acc, dependency) => {
                return acc.concat(dependency.pkg);
              }, []);

            if (links.length > 0) {
              await linkDependencies(npmClient, links, {
                cwd: env.cwd,
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
                cwd: env.cwd,
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
            console.log('Copying:', filepaths, 'to:', env.cwd);
            return Promise.all(
              filepaths.map(filepath => fs.copy(filepath, env.cwd))
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
});
