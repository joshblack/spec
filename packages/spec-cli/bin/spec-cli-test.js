'use strict';

const fs = require('fs-extra');
const path = require('path');
const test = require('../scripts/test');

const packageJsonPath = path.join(process.cwd(), 'package.json');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

fs.pathExists(packageJsonPath, (error, exists) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return;
  }
  if (exists) {
    // eslint-disable-next-line import/no-dynamic-require
    const packageJson = require(packageJsonPath);
    test(process.argv.slice(2), packageJson.jest || {});
    return;
  }
  test(process.argv.slice(2), {});
});
