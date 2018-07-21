'use strict';

const {
  init,
  installDependencies,
  linkDependencies,
  setupPackageJson,
} = require('@spec/cli-tools/npm');
const { clearConsole } = require('@spec/cli-tools/console');
const spawn = require('@spec/cli-tools/spawn');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const npmWhich = require('npm-which')(__dirname);
const path = require('path');
const util = require('util');

const which = util.promisify(npmWhich);

module.exports = ({ api, env }) => {
  api.addCommand({
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

      console.log(`Creating project: ${name} at: ${root}`);

      if (await fs.exists(root)) {
        throw new Error(`A folder already exists at ${root}`);
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

      clearConsole();

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'plugins',
          message:
            'Here are some project presets you can use if they look ' +
            'interesting. If not, feel free to select none and you can ' +
            'choose plugins manually.',
          choices: [
            {
              name: 'A React.js project',
              value: [
                '@spec/cli-plugin-env@next',
                '@spec/cli-plugin-paths@next',
                '@spec/cli-plugin-webpack@next',
                '@spec/cli-plugin-build@next',
                '@spec/cli-plugin-develop@next',
                '@spec/cli-plugin-format@next',
                '@spec/cli-plugin-ui-service@next',
              ],
            },
            {
              name: 'Hmm, not finding anything that I am looking for',
              value: null,
            },
          ],
        },
      ]);

      if (!answers.plugins) {
        console.log(
          'Sorry about that! Look out for more presets in the future.\n' +
            'In the meantime, feel free to add plugins using: ' +
            '`spec add <plugin-name>`'
        );
        console.log('You can now view your project in:', name);
        console.log(`Try running \`cd ${name}\``);
        return;
      }

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
      const plugins = answers.plugins.map(plugin => {
        if (cmd.link) {
          return plugin.replace(/\@next/, '');
        }
        return plugin;
      });

      for (const plugin of plugins) {
        const args = ['add', plugin, link && '--link'].filter(Boolean);
        await spawn(spec, args, {
          cwd: root,
          stdio: 'inherit',
        });
      }
    },
  });
};
