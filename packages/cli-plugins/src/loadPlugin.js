'use strict';

async function loadPlugin(descriptor, resolve) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const { error, plugin } = await resolve(name);

  return {
    error,
    name,
    plugin,
    options,
  };
}

module.exports = loadPlugin;
