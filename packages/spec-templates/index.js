'use strict';

const templateProduct = require('@spec/template-product');

const templates = new Map([[templateProduct.name, templateProduct]]);

module.exports = exports = templates;
exports.validTemplates = new Set(templates.keys());
exports.recommendedTemplates = ['product'];
