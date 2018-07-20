#!/usr/bin/env node

'use strict';

// Inspired by Create React App
// https://github.com/facebook/create-react-app/blob/next/packages/create-react-app/index.js

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  console.error(err);
  throw err;
});

var chalk = require('chalk');

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 8) {
  console.error(
    chalk.red(
      `You are running Node ${currentNodeVersion}.\n` +
        '@spec/cli requires Node 8 or higher, please update your version of Node.'
    )
  );
  process.exit(1);
}

const main = require('../src');

main(process).catch(error => {
  console.error(error);
  process.exit(1);
});
