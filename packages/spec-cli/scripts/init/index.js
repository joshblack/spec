'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const middleware = require('../tools/middleware');
const validTemplates = require('./templates');

// Convert template
// Validate template exists
// Make sure directory is clean
// Copy files over
// Install dependencies
// Update scripts
const command = middleware();

// Re-map template from `default` to `watson`
command.use(program => {
  if (program.template === 'default') {
    program.template = 'product';
  }
});

command.use((program, next) => {
  if (!validTemplates.has(program.template)) {
    const error = new Error(
      `No template available for template: \`${program.template}\`.`
    );
    error.suggestion =
      'Sorry about that! Try using one of our pre-defined ' +
      'templates instead, such as `product`.';
    next(error);
  }
});

command.use((program, next) => {
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
      'Try removing the files or running the command in a ' + 'new folder.';
    next(error);
  }
});

// Copy over the template that we've specified
command.use(async program => {
  const templatePath = path.resolve(__dirname, './templates', program.template);

  await fs.copy(templatePath, program.cwd);
  await fs.move(
    path.join(program.cwd, 'gitignore'),
    path.join(program.cwd, '.gitignore')
  );
});

// Update scripts in `package.json`
command.use(program => {
  const packageJson = require(program.cwd + '/package.json');
  if (packageJson.scripts === undefined) {
    packageJson.scripts = {};
  }
  packageJson.scripts = Object.assign({}, packageJson.scripts, {
    build: 'ocelot build',
    dev: 'ocelot dev',
    test: 'ocelot test',
    start: 'ocelot start',
  });
  return fs.writeJson(program.cwd + '/package.json', packageJson, {
    spaces: 2,
  });
});

command.use(program => {
  const dependencies = ['@ocelot/client', '@ocelot/server', '@ocelot/styles'];
  // TODO: add link flag?
  return new Promise((resolve, reject) => {
    // TODO: specify CLI tool to install
    const command = 'yarnpkg';
    const args = ['add', '--exact', ...dependencies];

    const child = spawn(command, args, { stdio: 'inherit' });
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
});

command.use(program => {
  const useYarn = true;
  // Change displayed command to yarn instead of yarnpkg
  // TODO: toggle based off of client option
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success!`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), program.cwd);
  console.log(`  ${chalk.cyan(`${displayedCommand} dev`)}`);
  console.log();
  console.log('Happy hacking!');
});

command.error(reason => {
  if (reason instanceof ReferenceError) {
    console.log('Error occurred!');
    console.log(
      'This is totally our fault, looks like we wrote some code that has ' +
        'a couple of bugs in it.'
    );
    console.log(
      'Please file an issue at <repo-url> with the following stack trace:'
    );
    console.log(reason);
    return;
  }
  console.log('Error occurred!');
  console.log('Message');
  console.log(reason.message);
  if (reason.suggestion) {
    console.log('Suggestion');
    console.log(reason.suggestion);
  }
  console.log(
    'View: http://docs-site/commands/init for more info about this command.'
  );
});

module.exports = command;
