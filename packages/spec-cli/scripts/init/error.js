'use strict';

/* eslint-disable no-console */

const chalk = require('chalk');
const packageJson = require('../../package.json');

const issuesURL = packageJson.bugs.url;

module.exports = reason => {
  if (reason instanceof ReferenceError) {
    console.log('Error occurred!');
    console.log(
      'This is totally our fault, looks like we wrote some code that has ' +
        'a couple of bugs in it.'
    );
    console.log(
      `Please file an issue at ${issuesURL} with the following stack trace:`
    );
    console.log(reason);
    return;
  }
  console.log(chalk.red('[spec-cli] Runtime error occured'));
  console.log(
    'Yikes, looks like something went wrong while we were scaffolding your ' +
      'application.'
  );
  console.log('Here is some info and possible suggestions for fixing it:');
  console.log();
  console.log(chalk.cyan('Reason:'));
  console.log(reason.message);
  if (reason.suggestion) {
    console.log(chalk.cyan('Suggestion:'));
    console.log(reason.suggestion);
    console.log();
  }
};
