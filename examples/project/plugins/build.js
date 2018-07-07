'use strict';

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');

module.exports = ({ api }) => {
  api.addCommand(program => {
    console.log('Add build command');
    program
      .command('build')
      .description('generate a production-ready bundle for your project')
      .action(async () => {
        const config = await api.read('webpack.config.production');
        const paths = await api.read('paths');

        fs.emptyDirSync(paths.appBuild);

        console.log('Creating an optimized production build...');

        webpack(config).run((error, stats) => {
          if (error) {
            printErrors('Failed to compile.', [error]);
            process.exit(1);
          }

          if (stats.compilation.errors.length) {
            printErrors('Failed to compile.', stats.compilation.errors);
            process.exit(1);
          }

          if (process.env.CI && stats.compilation.warnings.length) {
            printErrors('Failed to compile.', stats.compilation.warnings);
            process.exit(1);
          }

          console.log(chalk.green('Compiled successfully.'));
          console.log();
        });

        copyPublicFolder(paths);
      });
  });
};

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

function copyPublicFolder(paths) {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.html && !file.includes('.gitkeep'),
  });
}
