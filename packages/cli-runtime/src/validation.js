'use strict';

const Joi = require('joi');

// Definitely a great candidate for table-driven tests to make sure that this
// will validate the situations that we're looking for.
const configSchema = Joi.object()
  .keys({
    presets: Joi.array().items(
      Joi.string(),
      Joi.array()
        .min(1)
        .max(2)
        .ordered(Joi.string().required(), Joi.object())
    ),
    plugins: Joi.array().items(
      Joi.string(),
      Joi.array()
        .min(1)
        .max(2)
        .ordered(Joi.string().required(), Joi.object())
    ),
  })
  .required();

/**
 * @param {Object} config The configuration to validate
 * @returns {Object} The result of the validation. Should have the shape:
 * type ValidationResult = {
 *   error?: ValidationError,
 *   value?: Config
 * };
 */
function defaultValidateConfig(config) {
  return Joi.validate(config, configSchema);
}

const commandSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    options: Joi.array().items(
      Joi.object().keys({
        flags: Joi.string().required(),
        description: Joi.string().required(),
        defaults: Joi.string(),
      })
    ),
    action: Joi.func().required(),
  })
  .required();

function defaultValidateCommand(config) {
  return Joi.validate(config, commandSchema);
}

module.exports = {
  defaultValidateCommand,
  defaultValidateConfig,
};
