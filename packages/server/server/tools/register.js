'use strict';

const listen = require('./listen');
const logger = require('./logger');

const register = setupServer =>
  Promise.resolve(setupServer())
    .then(listen)
    .catch(error => {
      console.log(error);
      logger.error(error);
    });

module.exports = register;
