'use strict';

const chalk = require('chalk');
const nodemon = require('nodemon');

module.exports = ({ api }) => {
  api.addCommand({
    name: 'develop',
    description: 'start the development server',
    action() {
      let started = false;

      nodemon({
        script: 'src/server/index.js',
        ignore: ['src/client'],
        watch: ['config', 'src/server', 'src/shared'],
      });

      nodemon.on('start', () => {
        if (started) {
          console.log(chalk.green('Restarted successfully!'));
          return;
        }
        started = true;
        console.log(chalk.green('Watching files for changes...'));
      });

      nodemon.on('restart', () => {
        console.log(chalk.yellow('Restarting process due to changes...'));
      });

      nodemon.on('quit', () => {
        process.exit(0);
      });
    },
  });

  api.add(async ({ extendPackageJson }) => {
    await extendPackageJson(({ cliPath, packageJson }) => {
      return {
        scripts: {
          ...packageJson.scripts,
          develop: `${cliPath} develop`,
        },
      };
    });
  });
};
