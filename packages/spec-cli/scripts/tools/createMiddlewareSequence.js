'use strict';

const createMiddlewareSequence = () => {
  const middlewareStack = [];
  const errorStack = [];
  const apply = async program => {
    try {
      for (let i = 0; i < middlewareStack.length; i++) {
        const handler = middlewareStack[i];
        const next = error => {
          if (typeof error === 'string') {
            throw new Error(error);
          }
          throw error;
        };
        await handler(program, next);
      }
    } catch (error) {
      errorStack.forEach(handler => handler(error));
    }
  };
  apply.use = handler => middlewareStack.push(handler);
  apply.error = handler => errorStack.push(handler);
  return apply;
};

module.exports = createMiddlewareSequence;
