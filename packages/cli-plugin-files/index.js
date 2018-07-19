'use strict';

module.exports = async ({ api }) => {
  console.log('Files plugin!');

  api.add(() => {
    console.log('adding files plugin');
  });
};
