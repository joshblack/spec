'use strict';

const spawn = require('cross-spawn');

module.exports = exports = async program => {
  const { cwd, template, useNpm } = program;
  const npmClient = useNpm ? 'npm' : 'yarnpkg';
  const {
    localDependencies,
    dependencies,
    devDependencies,
  } = template.packageJson;
  const localInstallCommand = getInstallCommand(
    program.useNpm,
    program.npmLink
  );
  const installCommand = getInstallCommand(program.useNpm, false);

  await sequence([
    () => {
      if (hasDependencyType(localDependencies)) {
        return install(
          npmClient,
          [...localInstallCommand, ...localDependencies],
          cwd
        );
      }
    },
    () => {
      if (hasDependencyType(dependencies)) {
        return install(npmClient, [...installCommand, ...dependencies], cwd);
      }
    },
    () => {
      if (hasDependencyType(devDependencies)) {
        return install(npmClient, [...installCommand, ...devDependencies], cwd);
      }
    },
  ]);
};

const getInstallCommand = (useNpm, npmLink) => {
  if (npmLink) {
    return ['link'];
  }

  if (!useNpm) {
    return ['add', '--exact'];
  }

  return ['install', '--exact'];
};

const sequence = async iterable => {
  for (let item of iterable) {
    await item();
  }
};

const install = (npmClient, args, cwd) =>
  new Promise((resolve, reject) => {
    const installStep = spawn(npmClient, args, {
      cwd,
      stdio: 'inherit',
    });

    installStep.on('close', code => {
      if (code !== 0) {
        const error = new Error(
          'Install step failed with args: ' + args.join(' ')
        );
        reject(error);
        return;
      }
      resolve();
    });
  });

const hasDependencyType = dependencies => {
  if (Array.isArray(dependencies)) {
    if (dependencies.length > 0) {
      return true;
    }
  }
  return false;
};

exports.getInstallCommand = getInstallCommand;
exports.install = install;
exports.sequence = sequence;
exports.hasDependencyType = hasDependencyType;
