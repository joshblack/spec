'use strict';

const templates = require('@spec/templates');

module.exports = (program, next) => {
  if (!templates.has(program.template)) {
    const error = new Error(
      `No template available for template: \`${program.template}\`.`
    );
    error.suggestion =
      'Sorry about that! Try using one of our pre-defined ' +
      'templates instead, such as ' +
      templates.recommendedTemplates.join(', ');
    next(error);
  }

  program.template = templates.get(program.template);
};
