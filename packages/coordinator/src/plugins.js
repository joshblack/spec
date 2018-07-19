'use strict';

const {
  getClient,
  linkDependency,
  linkDependencies,
  installDependencies,
} = require('@spec/cli-tools/npm');
const fs = require('fs-extra');
const path = require('path');
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

async function loadPlugins(loader, resolve, logger) {
  logger.info('Loading plugins');

  const result = await loader();
  if (!result) {
    logger.debug('No config found');
    return [];
  }

  const { config, isEmpty } = result;
  if (isEmpty) {
    logger.debug('Config found, but nothing is specified');
    return [];
  }

  const { error, value } = Joi.validate(config, schema);
  if (error) {
    logger.error(error);
    throw error;
  }

  return await Promise.all(
    value.plugins.map(descriptor => loadPlugin(descriptor, resolve, logger))
  );
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

async function linkPlugin(name, cwd, logger) {
  logger.info(`Linking plugin: ${name}`);

  const npmClient = await getClient(cwd);
  const pkgName = name.includes('@') ? name.split('/')[1] : name;
  const pluginPath = path.resolve(__dirname, '../../', pkgName);

  if (await fs.pathExists(pluginPath)) {
    await linkDependency(npmClient, pluginPath);
  }

  await linkDependencies(npmClient, [name], { cwd });
}

module.exports = {
  loadPlugins,
  loadPlugin,
  linkPlugin,
};
