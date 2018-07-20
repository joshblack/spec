'use strict';

const EventEmitter = require('events');
const { subscribe } = require('graphql/subscription');

const { create: createProjectResolver } = require('./project');

exports.create = async function create(Coordinator) {
  const project = await createProjectResolver();

  return {
    project,
    plugins: Coordinator.plugins.map(({ name, options }) => ({
      name,
      options: [],
    })),
    tasks: Coordinator.api.commands,
  };
};
