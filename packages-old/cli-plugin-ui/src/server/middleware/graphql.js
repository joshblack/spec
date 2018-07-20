'use strict';

const { Coordinator } = require('@spec/coordinator');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema');
const { create } = require('../resolver');

module.exports = async server => {
  const resolver = await create(Coordinator);
  server.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
      rootValue: resolver,
      context: {
        cwd: Coordinator.cwd,
      },
    })
  );
  return server;
};
