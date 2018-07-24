'use strict';

const loadConfig = require('./loadConfig');
const loadPlugin = require('./loadPlugin');
const loadPlugins = require('./loadPlugins');
const loadPresets = require('./loadPresets');
const loadPreset = require('./loadPreset');
const resolve = require('./resolve');

module.exports = {
  loadConfig,
  loadPlugin,
  loadPlugins,
  loadPresets,
  loadPreset,
  resolve,
};
