'use strict';

const fs = require('fs-extra');
const path = require('path');
const {
  getGlobalBinPath,
  init,
  linkDependency,
  linkDependencies,
} = require('@spec/cli-tools/npm');
const spawn = require('@spec/cli-tools/spawn');

async function create(name, cmd, root, logger) {
  logger.info('Creating', `'${name}'`, 'with:', cmd, 'at:', root);

  const { npmClient, plugin, useLink } = cmd;
  const shellOptions = { cwd: root };

  if (await fs.pathExists(root)) {
    const files = await fs.readdir(root);

    if (files.length > 0) {
      const error = new Error(
        `Error creating preset in directory: ${root}. Directory already ` +
          'exists.'
      );
      error.suggestion =
        'Try removing the directory, or choosing an alternative name for the ' +
        'service to be written to.';

      throw error;
    }
  }

  await fs.ensureDir(root);
  await init(npmClient, shellOptions);

  if (useLink) {
    const localCLIPath = path.resolve(__dirname, '../../cli');

    await linkDependency(npmClient, localCLIPath);
    await linkDependencies(npmClient, ['@spec/cli'], shellOptions);

    const bin = await getGlobalBinPath(npmClient);
    const cli = path.join(bin.trim(), 'spec-cli');

    if (!(await fs.pathExists(cli))) {
      throw new Error('Unable to find local bin path for spec-cli');
    }

    await spawn(cli, ['add-local', '--npmClient', npmClient, plugin], {
      cwd: root,
      stdio: 'inherit',
    });
    return;
  }

  throw new Error('Not implemented yet :(');
}

module.exports = create;
