'use strict';

const spawn = require('cross-spawn');

const getInstallCommand = (useNpm, npmLink) => {
  if (npmLink) {
    return ['link'];
  }

  if (!useNpm) {
    return ['add', '--exact'];
  }

  return ['install', '--exact'];
};

// TODO: we could probably re-work this block to instead just place packages in
// the appropriate place in `package.json` then run `yarn`. For local stuff,
// keep the same setup as we need to be able to link when appropriate
module.exports = exports = program => {
  const npmClient = program.useNpm ? 'npm' : 'yarnpkg';
  const localDependencies = ['@spec/cli', '@spec/server'];
  const dependencies = ['react', 'react-dom', 'prop-types'];
  const devDependencies = [
    'prettier',
    'husky',
    'lint-staged',
    'validate-commit-msg',
  ];
  const localInstallCommand = getInstallCommand(
    program.useNpm,
    program.npmLink
  );
  const installCommand = getInstallCommand(program.useNpm, false);
  const localArgs = [...localInstallCommand, ...localDependencies];
  const dependencyArgs = [...installCommand, ...dependencies];
  const devDependencyArgs = [...installCommand, ...devDependencies];

  return new Promise((resolve, reject) => {
    const handleExitCode = (code, args) => {
      if (code !== 0) {
        const error = new Error(
          'Install step failed with args: ' + args.join(' ')
        );
        reject(error);
        return;
      }
    };

    const installLocalDependencies = spawn(npmClient, localArgs, {
      stdio: 'inherit',
    });

    installLocalDependencies.on('close', code => {
      handleExitCode(code, localArgs);

      const installDependencies = spawn(npmClient, dependencyArgs, {
        stdio: 'inherit',
      });

      installDependencies.on('close', code => {
        handleExitCode(code, dependencyArgs);

        const installDevDependencies = spawn(npmClient, devDependencyArgs, {
          stdio: 'inherit',
        });

        installDevDependencies.on('close', code => {
          handleExitCode(code, devDependencyArgs);
          resolve();
        });
      });
    });
  });
};

exports.getInstallCommand = getInstallCommand;
