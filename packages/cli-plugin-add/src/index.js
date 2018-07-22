'use strict';

const add = require('./add');

module.exports = ({ api, env }) => {
  api.addCommand({
    name: 'add <plugin-name>',
    description: 'add a plugin to your project',
    options: [
      {
        flags: '--link',
        description: 'link a local plugin to the project [DEV ONLY]',
      },
      {
        flags: '--link-cli',
        description: 'link `@spec/cli` for local development [DEV ONLY]',
      },
    ],
    action(plugin, cmd) {
      return add(api, env, plugin, cmd);
    },
  });
};
