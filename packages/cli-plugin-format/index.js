'use strict';

const chalk = require('chalk');
const spawn = require('@spec/cli-tools/spawn');
const npmWhich = require('npm-which');
const util = require('util');

const which = util.promisify(npmWhich(__dirname));
const defaultOptions = {
  jsxBracketSameLine: true,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
};

module.exports = ({ api, env }) => {
  api.addCommand({
    name: 'format',
    description: 'format your files, powered by prettier',
    async action() {
      const args = [
        ...formatOptions(defaultOptions),
        '--write',
        '**/*.{css,js,md,scss,ts}',
      ];

      const prettier = await which('prettier');

      console.log(chalk.grey(`prettier ${args.join(' ')}`));

      await spawn(prettier, args, {
        stdio: 'inherit',
        cwd: env.cwd,
      });
    },
  });

  api.addCommand({
    name: 'format:diff',
    description: 'verify files have been formatted by prettier',
    async action() {
      const args = [
        ...formatOptions(defaultOptions),
        '--list-different',
        '**/*.{css,js,md,scss,ts}',
      ];

      const prettier = await which('prettier');

      console.log(chalk.grey(`prettier ${args.join(' ')}`));

      await spawn(prettier, args, {
        stdio: 'inherit',
        cwd: env.cwd,
      });
    },
  });

  api.add(async ({ extendPackageJson }) => {
    await extendPackageJson(({ cliPath, packageJson }) => {
      return {
        scripts: {
          ...packageJson.scripts,
          format: `${cliPath} format`,
          'format:diff': `${cliPath} format:diff`,
        },
      };
    });
  });
};

function splitCamelCase(string) {
  const words = [''];
  let wordPosition = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === string[i].toUpperCase()) {
      words[++wordPosition] = '';
    }
    words[wordPosition] += string[i].toLowerCase();
  }
  return words;
}

function formatOptions(options) {
  return Object.keys(options)
    .map(key => {
      const flag = splitCamelCase(key).join('-');
      const value = options[key];

      if (typeof value === 'boolean') {
        return [`--${flag}`];
      }

      return [`--${flag}`, value];
    })
    .reduce((acc, flags) => acc.concat(flags), []);
}
