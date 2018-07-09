'use strict';

const path = require('path');
const { createLogger } = require('@spec/cli-tools/logger');
const create = require('./src');
const packageJson = require('./package.json');

const logger = createLogger(packageJson.name);

module.exports = ({ api, cwd }) => {
  api.addCommand({
    name: 'create <app-name>',
    description: 'create a new project powered by @spec/cli',
    options: [
      {
        flags: '-p, --plugin <pluginName>',
        description:
          'Specify the name of the plugin you want to use to use to create ' +
          'your project',
        defaults: '@spec/cli-plugin-ui-service',
      },
      {
        flags: '--npmClient <npmClient>',
        description: 'Specify the npm client that you would like to use',
        defaults: 'yarn',
      },
      {
        flags: '--use-link',
        description:
          'specify whether to use the npm client link command for the CLI ' +
          '[DEV ONLY]',
      },
    ],
    action(name, cmd) {
      create(name, cmd, path.join(cwd, name), logger);
    },
  });
};
