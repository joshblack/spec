'use strict';

const loadPresets = require('./loadPresets');
const loadPlugins = require('./loadPlugins');

async function loadConfig({ presets = [], plugins = [] }) {
  console.log('Load up the config');
  console.log(await loadPresets(presets));
  // const presets = await loadPresets(config.presets);
  // const plugins = presets.concat(await loadPlugins(config.plugins));
}

module.exports = loadConfig;
