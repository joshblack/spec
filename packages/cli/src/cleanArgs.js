'use strict';

// Inspired by Vue CLI:
// https://github.com/vuejs/vue-cli/blob/31e1b4995edef3d2079da654deedffe002a1d689/packages/%40vue/cli/bin/vue.js#L172
function cleanArgs(command) {
  return command.options.reduce((acc, option) => {
    // Add case for mapping `--foo-bar` to `fooBar`
    const key = option.long
      .replace(/^--/, '')
      .split('-')
      .map((word, i) => {
        if (i === 0) {
          return word;
        }
        return word[0].toUpperCase() + word.slice(1);
      })
      .join('');

    // If an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof command[key] !== 'function') {
      return {
        ...acc,
        [key]: command[key],
      };
    }
    return acc;
  }, {});
}

module.exports = cleanArgs;
