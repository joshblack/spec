'use strict';

module.exports = ({ Coordinator, api }) => {
  api.addCommand({
    name: 'add <plugin-name>',
    description: 'add a plugin to the project',
    async action(name) {
      Coordinator.add(name);
      console.log('adding plugin...', name);

      // Install locally as a dependency
      // Add plugin to Coordinator
    },
  });

  api.addCommand({
    name: 'add-local <plugin-name>',
    description: 'add a local plugin to the project [DEV ONLY]',
    async action(name) {
      Coordinator.addLocal(name);
      console.log('adding local plugin...', name);

      // Install locally as a dependency
      // Add plugin to Coordinator
    },
  });
};
