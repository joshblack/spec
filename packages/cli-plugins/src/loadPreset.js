'use strict';

async function loadPreset(descriptor, resolve) {
  const preset = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = preset;
  const { error, module: getConfig } = await resolve(name);

  if (error) {
    return {
      error,
    };
  }

  try {
    const config = getConfig(options);
    console.log(config);
  } catch (error) {
    return { error };
  }

  // return {
  // error,
  // name,
  // plugin,
  // options,
  // };
}

module.exports = loadPreset;
