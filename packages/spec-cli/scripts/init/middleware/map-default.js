'use strict';

// Re-map template from `default` to `watson`
module.exports = program => {
  if (program.template === 'default') {
    program.template = 'product';
  }
};
