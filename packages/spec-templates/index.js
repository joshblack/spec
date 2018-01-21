'use strict';

const templates = new Map(
  [require('@spec/template-product'), require('@spec/template-micro')].map(
    template => [template.name, template]
  )
);

module.exports = exports = templates;
exports.validTemplates = new Set(templates.keys());
exports.recommendedTemplates = ['product'];
