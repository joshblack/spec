'use strict';

const fs = require('fs-extra');

module.exports = (program, next) => {
  const originalFileWhitelist = new Set(['node_modules', 'package.json']);
  const filesInDirectory = fs
    .readdirSync(program.cwd)
    .filter(file => !originalFileWhitelist.has(file));

  if (filesInDirectory.length !== 0) {
    const error = new Error(
      'You have files in this directory already. Running init might ' +
        'overwrite them'
    );
    error.suggestion =
      `Try removing the following files or running the command in a ` +
      `new folder. Files: ${JSON.stringify(filesInDirectory)}`;
    next(error);
  }
};
