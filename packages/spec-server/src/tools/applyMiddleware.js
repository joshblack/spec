/* @flow */

import type { Context, Middleware, Server } from '../types';

const applyMiddleware = (
  server: Server,
  middleware: Array<Middleware>,
  context: Context
): Promise<Server> => {
  /**
   * The setup process here involves:
   *
   * 1) Iterate through each potentially async middleware
   * 2) Try to resolve the middleware with Promise.resolve(), which will work
   *    for middleware that return promises or values
   * 3) Apply the middleware to the current iteration of the server with the
   *    given build context
   */
  const setup = middleware.reduce(
    (promise: Server, apply: Middleware): Promise<Server> =>
      promise.then(prevServer => apply(prevServer, context)),
    Promise.resolve(server)
  );

  return Promise.resolve(setup);
};

module.exports = applyMiddleware;
