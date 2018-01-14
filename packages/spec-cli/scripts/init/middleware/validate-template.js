'use strict';

const validTemplates = require('../templates');

module.exports = (program, next) => {
  if (!validTemplates.has(program.template)) {
    const error = new Error(
      `No template available for template: \`${program.template}\`.`
    );
    error.suggestion =
      'Sorry about that! Try using one of our pre-defined ' +
      'templates instead, such as `product`.';
    next(error);
  }
};
