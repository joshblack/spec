'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = async program => {
  const templatePath = path.resolve(
    require.resolve('@spec/templates'),
    '..',
    program.template
  );
  await fs.copy(templatePath, program.cwd);
  await fs.move(
    path.join(program.cwd, 'gitignore'),
    path.join(program.cwd, '.gitignore')
  );
};
