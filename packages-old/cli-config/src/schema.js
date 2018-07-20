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

module.exports = schema;
