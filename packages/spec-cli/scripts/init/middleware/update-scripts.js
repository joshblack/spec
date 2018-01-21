'use strict';

const fs = require('fs-extra');
const path = require('path');
const packageJson = require('../../../package.json');

const CLI_NAME = Object.keys(packageJson.bin)[0];
const exists = (key, field, replacement) => {
  if (typeof field !== 'undefined') {
    return {
      [key]: field,
    };
  }
  if (typeof replacement !== 'undefined') {
    return {
      [key]: replacement,
    };
  }
  return {};
};

module.exports = async program => {
  const { packageJson: templatePackageJson } = program.template;
  const localPackageJsonPath = path.join(program.cwd + '/package.json');
  let localPackageJson = (await fs.pathExists(localPackageJsonPath))
    ? await fs.readJson(localPackageJsonPath)
    : {};

  localPackageJson = Object.assign(
    {},
    exists(
      'name',
      localPackageJson.name,
      templatePackageJson.name({
        directory: program.directory
          ? program.args[0]
          : path.basename(program.cwd),
      })
    ),
    exists('private', localPackageJson.private, true),
    exists('version', localPackageJson.version, '1.0.0'),
    {
      scripts: {
        ...localPackageJson.scripts,
        ...templatePackageJson.scripts({
          npmClient: program.useNpm ? 'npm' : 'yarn',
          /* eslint-disable indent */
          cliCommand: program.npmLink
            ? path.relative(
                program.cwd,
                path.resolve(__dirname, '../../../bin/spec-cli.js')
              )
            : CLI_NAME,
          /* eslint-enable indent */
        }),
      },
    },
    {
      spec: {
        template: program.template.name,
      },
    },
    exists('config', localPackageJson.config),
    exists('lint-staged', localPackageJson['lint-staged']),
    exists('prettier', localPackageJson.prettier)
  );

  return fs.writeJson(program.cwd + '/package.json', localPackageJson, {
    spaces: 2,
  });
};
