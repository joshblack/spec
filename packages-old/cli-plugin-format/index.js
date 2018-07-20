'use strict';

const chalk = require('chalk');
const spawn = require('cross-spawn');
const npmWhich = require('npm-which');
const util = require('util');

const defaultOptions = {
  jsxBracketSameLine: true,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
};

const spawnAsync = (command, args, options) =>
  new Promise((resolve, reject) => {
    console.log(chalk.grey(`prettier ${args.join(' ')}`));

    const child = spawn(command, args, options);
    child.on('close', code => {
      if (code !== 0) {
        const error = new Error(
          `Error running the command: ${command} ${args.join(' ')}`
        );
        reject(error);
        return;
      }
      resolve();
    });
  });

const which = util.promisify(npmWhich(__dirname));

module.exports = ({ api, cwd, options }) => {
  const prettierOptions = {
    ...defaultOptions,
    ...options,
  };

  api.addCommand({
    name: 'format',
    description: 'format files in your codebase, powered by prettier',
    async action() {
      const args = [
        ...formatOptions(prettierOptions),
        '--write',
        '**/*.{css,js,md,scss,ts}',
      ];

      const prettier = await which('prettier');
      await spawnAsync(prettier, args, {
        stdio: 'inherit',
        cwd,
      });
    },
  });

  api.addCommand({
    name: 'format:diff',
    description:
      'check if your files are formatted different than what prettier expects',
    async action() {
      const args = [
        ...formatOptions(prettierOptions),
        '--list-different',
        '**/*.{css,js,md,scss,ts}',
      ];

      const prettier = await which('prettier');

      try {
        await spawnAsync(prettier, args, {
          stdio: 'inherit',
          cwd,
        });
      } catch (error) {
        process.exit(1);
      }
    },
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
