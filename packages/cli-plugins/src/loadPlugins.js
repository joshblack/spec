'use strict';

const loadPlugin = require('./loadPlugin');

async function loadPlugins(descriptors, resolve) {
  const plugins = await Promise.all(
    descriptors.map(descriptor => loadPlugin(descriptor, resolve))
  );

  return plugins;
}

module.exports = loadPlugins;
