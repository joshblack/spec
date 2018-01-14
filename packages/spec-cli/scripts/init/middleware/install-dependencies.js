'use strict';

const spawn = require('cross-spawn');

const getInstallCommand = (npmClient, npmLink) => {
  if (npmLink) {
    return ['link'];
  }

  if (npmClient === 'yarnpkg') {
    return ['add', '--exact'];
  }

  return ['install', '--exact'];
};

module.exports = exports = program => {
  const dependencies = ['@spec/client', '@spec/server'];
  return new Promise((resolve, reject) => {
    const args = [
      ...getInstallCommand(program.npmClient, program.npmLink),
      ...dependencies,
    ];
    const child = spawn(program.npmClient, args, { stdio: 'inherit' });
    child.on('close', code => {
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
};

exports.getInstallCommand = getInstallCommand;
