'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('./spawn');

function getInstallCommand(npmClient) {
  if (npmClient === 'npm') {
    return 'install';
  }

  if (npmClient === 'yarn') {
    return 'add';
  }

  throw new Error(
    `Unrecognized npm client: \`${npmClient}\`. Only npm and yarn are supported.`
  );
}

function getSaveFlag(npmClient, hasDevDependencies) {
  if (npmClient === 'npm') {
    if (hasDevDependencies) {
      return '--save-dev';
    }
    return '--save';
  }

  if (npmClient === 'yarn') {
    if (hasDevDependencies) {
      return '--dev';
    }
    return;
  }

  throw new Error(
    `Unrecognized npm client: \`${npmClient}\`. Only npm and yarn are supported.`
  );
}

function getRunCommand(npmClient) {
  if (npmClient === 'npm') {
    return 'npm run';
  }

  if (npmClient === 'yarn') {
    return 'yarn';
  }

  throw new Error(
    `Unrecognized npm client: \`${npmClient}\`. Only npm and yarn are supported.`
  );
}

function getGlobalBinPath(npmClient) {
  return spawn(npmClient, ['global', 'bin']);
}

function linkDependency(npmClient, cwd, options = {}) {
  return spawn(npmClient, ['link'], {
    cwd,
    ...options,
  });
}

function linkDependencies(
  npmClient,
  packages,
  { cwd, stdio = 'inherit' } = {}
) {
  return spawn(npmClient, ['link', ...packages], {
    cwd,
    stdio,
  });
}

function install(npmClient, { cwd, stdio = 'inherit', ...rest } = {}) {
  return spawn(npmClient, ['install'], {
    cwd,
    stdio,
    ...rest,
  });
}

function installDependencies(
  npmClient,
  packages,
  { cwd, stdio = 'inherit', ...rest } = {}
) {
  const command = getInstallCommand(npmClient);
  const flag = getSaveFlag(npmClient, false);
  return spawn(npmClient, [command, ...packages, flag].filter(Boolean), {
    cwd,
    stdio,
    ...rest,
  });
}

function installDevDependencies(
  npmClient,
  packages,
  { cwd, stdio = 'inherit', ...rest } = {}
) {
  const command = getInstallCommand(npmClient);
  const flag = getSaveFlag(npmClient, true);
  return spawn(npmClient, [command, ...packages, flag].filter(Boolean), {
    cwd,
    stdio,
    ...rest,
  });
}

function init(npmClient, { cwd, stdio = 'inherit', ...rest }) {
  return spawn(npmClient, ['init', '-y'], {
    cwd,
    stdio,
    ...rest,
  });
}

async function getClient(root) {
  const yarnLockfile = path.join(root, 'yarn.lock');
  if (await fs.pathExists(yarnLockfile)) {
    return 'yarn';
  }

  const npmLockfile = path.join(root, 'package-lock.json');
  if (await fs.pathExists(npmLockfile)) {
    return 'npm';
  }

  try {
    await spawn('yarn', ['--version'], { cwd: root });
    return 'yarn';
  } catch (error) {}

  try {
    await spawn('npm', ['--version'], { cwd: root });
    return 'npm';
  } catch (error) {}

  throw new Error(`Cannot infer npm client from: ${root}`);
}

module.exports = {
  init,
  install,
  installDependencies,
  installDevDependencies,
  linkDependency,
  linkDependencies,
  getInstallCommand,
  getSaveFlag,
  getRunCommand,
  getGlobalBinPath,
  getClient,
};
