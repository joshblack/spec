'use strict';

const {
  getClient,
  installDependencies,
  installDevDependencies,
  linkDependencies,
  setupPackageJson,
} = require('@spec/cli-tools/npm');
const fs = require('fs-extra');
const path = require('path');
const npmWhich = require('npm-which')(__dirname);
const util = require('util');
const { loadPlugin, resolve: defaultResolve } = require('@spec/cli-plugins');

const which = util.promisify(npmWhich);

module.exports = ({ api, env }) => {
  api.addCommand({
    name: 'add <plugin-name>',
    description: 'add a plugin to your project',
    options: [
      {
        flags: '--link',
        description: 'link a local plugin to the project [DEV ONLY]',
      },
    ],
    async action(packageName, cmd) {
      console.log('Add plugin:', packageName, 'with options:', cmd);

      const name = removeVersionFromName(packageName);
      const { cwd, npmClient } = env;
      const { read, write } = setupPackageJson(env.cwd);
      const packageJson = await read();

      // TODO add support for ['plugin', {}] variant
      if (packageJson.spec.plugins.indexOf(name) !== -1) {
        throw new Error(
          `The plugin ${name} has already been added to the project`
        );
      }

      packageJson.spec.plugins.push(name);
      await write(packageJson);

      if (cmd.link) {
        await linkDependencies(npmClient, [name], {
          cwd: env.cwd,
        });
      } else {
        await installDependencies(npmClient, [packageName], {
          cwd: env.cwd,
        });
      }

      const spec = await which('spec');
      const plugin = await loadPlugin(name, defaultResolve);
      // // const api = new PluginAPI({ store: api.store });
      // const plugin = {
      // name,
      // options: {},
      // plugin: await defaultResolve(name),
      // };
      await plugin.plugin({
        api,
        options: plugin.options,
        env,
      });

      const add = {
        copy: copy(cwd),
        extendPackageJson: extendPackageJson(read, write, npmClient, spec),
        installDependencies: createInstaller(
          installDependencies,
          npmClient,
          cwd
        ),
        installDevDependencies: createInstaller(
          installDevDependencies,
          npmClient,
          cwd
        ),
        linkDependencies: createInstaller(
          cmd.link ? linkDependencies : installDependencies,
          npmClient,
          cwd
        ),
      };

      for (const thunk of api.thunks.add) {
        await thunk(add);
      }
    },
  });
};

function createInstaller(install, npmClient, cwd) {
  return dependencies => {
    const args = dependencies.map(dependency => {
      if (typeof dependency === 'string') {
        return dependency;
      }
      return `${dependency.name}@${dependency.version}`;
    });
    return install(npmClient, args, {
      cwd,
    });
  };
}

function copy(root) {
  return async files => {
    console.log('Copying:', files, 'to:', root);
    return Promise.all(files.map(filepath => fs.copy(filepath, root)));
  };
}

function extendPackageJson(read, write, npmClient, cliPath) {
  return async updater => {
    const remotePackageJson = await read();
    const packageJson = {
      ...remotePackageJson,
      ...updater({
        npmClient,
        cliPath,
        packageJson: remotePackageJson,
      }),
    };

    if (packageJson.scripts) {
      packageJson.scripts = alphabetize(packageJson.scripts);
    }

    await write(packageJson);
  };
}
function alphabetize(object) {
  return Object.keys(object)
    .sort()
    .reduce((acc, key) => {
      const value = object[key];
      return {
        ...acc,
        [key]: typeof value === 'object' ? alphabetize(object) : value,
      };
    }, {});
}

function removeVersionFromName(name) {
  // Scoped package
  if (name[0] === '@') {
    return (
      '@' +
      name
        .split('@')
        .slice(0, 2)
        .join('')
    );
  }
  return name
    .split('@')
    .slice(0, 1)
    .join('');
}
