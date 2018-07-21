'use strict';

async function loadPlugin(descriptor, resolve) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;
  const plugin = await resolve(name);

  return {
    name,
    plugin,
    options,
  };
}

module.exports = loadPlugin;
