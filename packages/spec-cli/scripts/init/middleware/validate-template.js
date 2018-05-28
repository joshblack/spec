'use strict';

const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

const getTemplatePackage = async (string, { cwd, npmClient = 'yarn' }) => {
  if (string.includes('https') || string.includes('git')) {
    const error = new Error('Recieved a possible URL-based template');
    error.suggestion =
      'We currently do not support URL-based templates, ' +
      'but we hope to in the future!';
    return { error };
  }

  const pkg = `@spec/template-${string}`;

  try {
    await execAsync(`${npmClient} info ${pkg}`, {
      cwd,
    });
  } catch (e) {
    const error = new Error(
      'Received a template name for a package that does not exist'
    );
    error.suggestion =
      'Looks like the name for the template that you passed in ' +
      'is not currently published to npm.\nSpecifically, the command ' +
      `\`${npmClient} info ${pkg}\` did not return any results.`;
    return { error };
  }

  return { pkg };
};

module.exports = exports = async (program, next) => {
  const { error, pkg } = await getTemplatePackage(program.template, {
    cwd: program.cwd,
  });

  if (error) {
    next(error);
    return;
  }

  program.template = pkg;
};
