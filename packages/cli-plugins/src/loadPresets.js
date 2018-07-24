'use strict';

const loadPreset = require('./loadPreset');

async function loadPresets(descriptors, resolve) {
  const plugins = await Promise.all(
    descriptors.map(descriptor => loadPreset(descriptor, resolve))
  );
  return plugins;
}

module.exports = loadPresets;
