'use strict';

async function loadPlugins(loader, resolve, validate, logger) {
  // logger.info('Loading plugins');

  // const result = await loader();
  // if (!result) {
    // logger.debug('No config found');
    // return [];
  // }

  // const { config, isEmpty } = result;
  // if (isEmpty) {
    // logger.debug('Config found, but nothing is specified');
    // return [];
  // }

  // const { error, value } = Joi.validate(config, schema);
  // if (error) {
    // logger.error(error);
    // throw error;
  // }

  // return await Promise.all(
    // value.plugins.map(descriptor => loadPlugin(descriptor, resolve, logger))
  // );
}

async function loadPlugin(descriptor, resolve, logger) {
  const config = Array.isArray(descriptor) ? descriptor : [descriptor];
  const [name, options = {}] = config;

  logger.info('Loading plugin:', name);

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
