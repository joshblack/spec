'use strict';

const spawn = require('cross-spawn');

function spawnAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    const defaultStderr = {
      command: `${command} ${args.join(' ')}`,
    };
    let stdout = '';
    let stderr = '';

    if (child.stdout) {
      child.stdout.on('data', data => {
        stdout += `${data}`;
      });
    }

    if (child.stderr) {
      child.stderr.on('data', data => {
        stderr += `${data}`;
      });
    }

    child.on('close', code => {
      if (code !== 0) {
        reject(stderr || defaultStderr);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = spawnAsync;
