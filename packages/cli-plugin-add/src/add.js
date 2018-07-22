'use strict';

const { createLogger } = require('@spec/cli-logger');
const { createClient, getPackageInfoFrom } = require('@spec/npm');
const fs = require('fs-extra');
const path = require('path');
const npmWhich = require('npm-which')(__dirname);
const util = require('util');
const { loadPlugin, resolve: defaultResolve } = require('@spec/cli-plugins');

const logger = createLogger('@spec/cli-plugin-add');
const which = util.promisify(npmWhich);

async function add(api, env, descriptor, cmd) {
  logger.trace('Add plugin:', descriptor, 'with options:', cmd);

  const { cwd, npmClient } = env;
  const { name, version } = getPackageInfoFrom(descriptor);
  const {
    error,
    readPackageJson,
    writePackageJson,
    linkDependencies,
    installDependencies,
    installDevDependencies,
  } = createClient(npmClient, cwd);
  if (error) {
    throw error;
  }

  const packageJson = await readPackageJson();

  // TODO add support for ['plugin', {}] variant
  if (packageJson.spec.plugins.indexOf(name) !== -1) {
    throw new Error(`The plugin ${name} has already been added to the project`);
  }

  packageJson.spec.plugins.push(name);
  await writePackageJson(packageJson);

  const installer = cmd.link ? linkDependencies : installDependencies;
  const dependency = cmd.link ? name : `${name}@${version}`;

  await installer([dependency]);

  const spec = await which('spec');
  const plugin = await loadPlugin(name, defaultResolve);
  await plugin.plugin({
    api,
    options: plugin.options,
    env,
  });

  const add = {
    copy: copy(cwd),
    extendPackageJson: extendPackageJson(
      readPackageJson,
      writePackageJson,
      npmClient,
      cmd.linkCli ? spec : 'spec'
    ),
    installDependencies,
    installDevDependencies,
    linkDependencies: cmd.link ? linkDependencies : installDependencies,
  };

  for (const thunk of api.thunks.add) {
    await thunk(add);
  }
}

function copy(root) {
  return async files => {
    logger.trace('Copying:', files, 'to:', root);
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

module.exports = add;
