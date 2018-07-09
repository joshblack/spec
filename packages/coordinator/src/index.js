'use strict';

const program = require('commander');
const addPlugin = require('@spec/cli-plugin-add');
const createPlugin = require('@spec/cli-plugin-create');
const Coordinator = require('./Coordinator');
const { logger } = require('@spec/cli-tools/logger');

const defaultPlugins = [
  {
    name: '@spec/cli-plugin-add',
    plugin: addPlugin,
    options: {},
  },
  {
    name: '@spec/cli-plugin-create',
    plugin: createPlugin,
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
