'use strict';

module.exports = ({ options }) => {
  return {
    plugins: [
      () => {
        console.log('Custom plugin from a preset?');
      },
    ],
  };
};
