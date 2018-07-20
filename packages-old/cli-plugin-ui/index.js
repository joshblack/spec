'use strict';

module.exports = ({ api }) => {
  api.addCommand({
    name: 'ui',
    description: 'use a GUI to manage your project',
    action() {
      process.env.NODE_ENV = 'production';
      process.env.DEPLOY_ENV = 'local';

      const register = require('@spec/server/tools/register');
      const setupServer = require('./src/server/server');

      register(setupServer);
    },
  });
};
