'use strict';

const createMiddlewareSequence = require('../tools/createMiddlewareSequence');

const command = createMiddlewareSequence();
const middleware = [
  // Validate template exists
  require('./middleware/validate-template'),
  // Make sure directory is clean
  require('./middleware/check-clean-dir'),
  // Copy files over
  require('./middleware/copy-files'),
  // Update scripts
  require('./middleware/update-scripts'),
  // Install dependencies
  require('./middleware/install-dependencies'),
  // Display success message with steps to start using the new project
  require('./middleware/display-success'),
];

const error = [require('./error')];

middleware.forEach(handler => {
  command.use(handler);
});

error.forEach(handler => {
  command.error(handler);
});

module.exports = command;
