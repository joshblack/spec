/* @flow */

'use strict';

const listen = require('./listen');
const logger = require('./logger');

import type { Server } from '../types';

const register = (setupServer: () => Promise<Server> | (() => Server)) =>
  Promise.resolve(setupServer())
    .then(listen)
    .catch(error => {
      logger.error(error);
    });

module.exports = exports = register;
