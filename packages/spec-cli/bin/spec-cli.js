#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const templates = require('@spec/templates');
const packageJson = require('../package.json');

const localPackageJsonPath = path.join(process.cwd(), 'package.json');
const hasSpecTemplate = localPackageJson => {
  if (typeof localPackageJson === 'object') {
    if (typeof localPackageJson.spec === 'object') {
      if (typeof localPackageJson.spec.template === 'string') {
        return true;
      }
    }
  }
  return false;
};
const noop = () => {};
const getSpecTemplate = localPackageJson => {
  const templateName = localPackageJson.spec.template;
  if (templates.has(templateName)) {
    const template = templates.get(templateName);
    return template.cli || noop;
  }
  return noop;
};

fs
  .pathExists(localPackageJsonPath)
  .then(exists => {
    if (!exists) {
      return;
    }
    return fs.readJson(localPackageJsonPath);
  })
  .then(localPackageJson =>
    [
      localProgram =>
        localProgram
          .version(packageJson.version)
          .description(packageJson.description)
          .command('init', 'initialize the project'),
      hasSpecTemplate(localPackageJson) && getSpecTemplate(localPackageJson),
    ].filter(Boolean)
  )
  .then(hooks => {
    const cli = hooks.reduce((localProgram, hook) => {
      return hook(localProgram);
    }, program);
    cli.parse(process.argv);
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
