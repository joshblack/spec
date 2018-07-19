'use strict';

// const Config = require('@spec/cli-config');
const {
  getClient,
  installDependencies,
  linkDependencies,
  linkDependency,
} = require('@spec/cli-tools/npm');
const fs = require('fs-extra');
const path = require('path');

module.exports = ({ api, env }) => {
  api.addCommand({
    name: 'add <plugin-name>',
    description: 'add a plugin to the project',
    options: [
      {
        flags: '--link',
        description: 'link a local plugin to the project [DEV ONLY]',
      },
    ],
    async action(name, cmd) {
      console.log(env);
      // console.log('Add plugin:', name, 'with options:', cmd);

      // const { link } = cmd;
      // const npmClient = await getClient(cwd);

      // const config = new Config(cwd);

      // await config.find();

      // return;

      // if (link) {
      // const pkgName = name.includes('@') ? name.split('/')[1] : name;
      // const pluginPath = path.resolve(__dirname, '../', pkgName);
      // if (await fs.pathExists(pluginPath)) {
      // await linkDependency(npmClient, pluginPath);
      // }

      // await linkDependencies(npmClient, [name], { cwd });
      // console.log('hi');

      // // await Coordinator.install(name);

      // return;
      // }

      // throw new Error('Not implemented :(');
    },
  });
};
