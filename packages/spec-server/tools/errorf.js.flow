/* @flow */

'use strict';

import type { ErrorMessage } from '../types';

function errorf(
  error: Error,
  format: string,
  ...args: Array<any>
): ErrorMessage {
  let index = 0;
  return {
    title: error.message || 'Internal Server Error.',
    details: [format.replace(/%s/g, () => args[index++])],
  };
}

module.exports = errorf;
