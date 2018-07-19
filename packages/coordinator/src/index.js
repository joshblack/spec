'use strict';

const program = require('commander');
const Coordinator = require('./Coordinator');
const { logger } = require('@spec/cli-tools/logger');

const defaultPlugins = [
  {
    name: '@spec/cli-plugin-add',
    plugin: require('@spec/cli-plugin-add'),
    options: {},
  },
  {
    name: '@spec/cli-plugin-create',
    plugin: require('@spec/cli-plugin-create'),
    options: {},
  },
];

module.exports = {
  Coordinator: new Coordinator({
    name: 'spec',
    cwd: process.cwd(),
    program,
    logger,
    defaultPlugins,
  }),
};
