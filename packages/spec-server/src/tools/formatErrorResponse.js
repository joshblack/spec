/* @flow */

import type { ErrorMessage, ErrorResponse } from '../types';

const formatErrorMessage = (error: ErrorMessage): ErrorMessage => {
  const { title = 'Internal Server Error.', status = 500, details } = error;
  return {
    status,
    title,
    details,
  };
};

const formatErrorResponse = (errors: Array<ErrorMessage>): ErrorResponse => ({
  errors: errors.map(formatErrorMessage),
});

module.exports = exports = formatErrorResponse;
exports.formatErrorMessage = formatErrorMessage;
