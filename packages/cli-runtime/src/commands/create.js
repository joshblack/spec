'use strict';

const {
  init,
  installDependencies,
  linkDependencies,
  setupPackageJson,
} = require('@spec/cli-tools/npm');
const spawn = require('@spec/cli-tools/spawn');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const util = require('util');

const which = util.promisify(npmWhich);

module.exports = ({ env }) => ({
  name: 'create <project-name>',
  description: 'create a new project managed by `@spec/cli`',
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
  async action(name, cmd) {
    const { cwd, npmClient } = env;
    const { link, linkCli } = cmd;
    const root = path.join(cwd, name);

    console.log('Creating project:', name, 'at:', root);

    if (await fs.exists(root)) {
      console.log(`A folder already exists at ${root}`);
      return;
    }

    await fs.ensureDir(root);

    const { read, write } = setupPackageJson(root);
    const packageJson = {
      name,
      private: true,
      license: 'MIT',
      scripts: {},
      dependencies: {},
      spec: {
        plugins: [],
      },
    };

    await write(packageJson);

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Choose which plugins to install',
        choices: [
          '@spec/cli-plugin-format@next',
          '@spec/cli-plugin-env@next',
          '@spec/cli-plugin-paths@next',
          '@spec/cli-plugin-build@next',
          '@spec/cli-plugin-develop@next',
          '@spec/cli-plugin-webpack@next',
          '@spec/cli-plugin-ui-service@next',
        ],
        default: [
          '@spec/cli-plugin-format@next',
          // '@spec/cli-plugin-env@next',
          // '@spec/cli-plugin-paths@next',
          // '@spec/cli-plugin-build@next',
          // '@spec/cli-plugin-develop@next',
          // '@spec/cli-plugin-webpack@next',
          // '@spec/cli-plugin-ui-service@next',
        ],
      },
    ]);
    const plugins = answers.plugins.map(plugin => {
      if (cmd.link) {
        return plugin.replace(/\@next/, '');
      }
      return plugin;
    });

    if (cmd.linkCli) {
      await linkDependencies(npmClient, ['@spec/cli'], {
        cwd: root,
      });
    } else {
      await installDependencies(npmClient, ['@spec/cli@next'], {
        cwd: root,
      });
    }

    const spec = await which('spec', { cwd: root });

    for (const plugin of plugins) {
      const args = ['add', plugin, link && '--link'].filter(Boolean);
      await spawn(spec, args, {
        cwd: root,
        stdio: 'inherit',
      });
    }
  },
});
