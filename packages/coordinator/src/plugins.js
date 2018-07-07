'use strict';

const Joi = require('joi');

const schema = {
  plugins: Joi.array().items(
    Joi.string().required(),
    Joi.array()
      .min(1)
      .max(2)
      .items(Joi.string().required(), Joi.object())
  ),
};

async function loadPlugins(loader, resolve) {
  console.log('Loading plugins...');
  const result = await loader();
  if (!result) {
    console.log('No config found');
    return;
  }

  const { config, isEmpty } = result;
  if (isEmpty) {
    console.log('Config found, but nothing is specified');
    return;
  }

  const { error, value } = Joi.validate(config, schema);
  if (error) {
    console.log(error);
    return;
  }

  return await Promise.all(
    value.plugins.map(descriptor => loadPlugin(descriptor, resolve))
  );
}

async function loadPlugin(descriptor, resolve) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;

  console.log('Loading plugin:', name);

  const plugin = await resolve(name);

  return {
    name,
    plugin,
    options,
  };
}

module.exports = {
  loadPlugins,
  loadPlugin,
};
