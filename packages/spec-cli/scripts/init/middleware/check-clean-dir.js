'use strict';

const path = require('path');
const fs = require('fs-extra');
const util = require('util');

const readdirAsync = util.promisify(fs.readdir);

const originalFileWhitelist = new Set([
  'node_modules',
  'package.json',
  'yarn.lock',
  'package-lock.json',
]);

module.exports = async (program, next) => {
  if (program.args.length !== 0) {
    program.directory = path.join(program.cwd, program.args[0]);
  }

  // If the directory doesn't exist yet, all we need to do is create it and
  // update the current working directory to the directory we just created
  if (!await fs.pathExists(program.directory)) {
    await fs.ensureDir(program.directory);
    program.cwd = program.directory;
    return;
  }

  const filesInDirectory = (await readdirAsync(program.cwd)).filter(
    file => !originalFileWhitelist.has(file)
  );

  if (filesInDirectory.length !== 0) {
    const error = new Error(
      'You have files in this directory already. Running init might ' +
        'overwrite them'
    );
    error.suggestion =
      'Try removing the following files or running the command in a ' +
      `new folder. Files: ${JSON.stringify(filesInDirectory)}`;
    next(error);
  }
};
