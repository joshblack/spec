'use strict';

// eslint-plugin-react <https://github.com/yannickcr/eslint-plugin-react>
module.exports = {
  plugins: ['react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Prevent missing displayName in a React component definition
    'react/display-name': ['error', { ignoreTranspilerName: false }],

    // Forbid certain propTypes
    'react/forbid-prop-types': 'error',

    // Enforce boolean attributes notation in JSX
    'react/jsx-boolean-value': 'off',

    // Validate closing bracket location in JSX
    'react/jsx-closing-bracket-location': [
      'error',
      { nonEmpty: 'after-props' },
    ],

    // Enforce or disallow spaces inside of curly braces in JSX attributes
    'react/jsx-curly-spacing': ['error', 'never'],

    // Validate props indentation in JSX
    'react/jsx-indent-props': ['error', 2],

    // Validate indentation style for JSX
    'react/jsx-indent': ['error', 2],

    // Enforce event handler naming conventions in JSX
    'react/jsx-handler-names': 'off',

    // Validate JSX has key prop when in array or iterator
    'react/jsx-key': 'error',

    // Limit maximum of props on a single line in JSX
    'react/jsx-max-props-per-line': ['error', { maximum: 4 }],

    // Prevent usage of .bind() and arrow functions in JSX props
    'react/jsx-no-bind': 'off',

    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],

    // Prevent usage of unwrapped JSX strings
    'react/jsx-no-literals': 'off',

    // Disallow undeclared variables in JSX
    'react/jsx-no-undef': 'error',

    // Enforce PascalCase for user-defined JSX components
    'react/jsx-pascal-case': 'error',

    // Enforce quote style for JSX attributes
    'jsx-quotes': ['error', 'prefer-double'],

    // Enforce propTypes declarations alphabetical sorting
    'react/jsx-sort-prop-types': 'off',

    // Enforce props alphabetical sorting
    'react/jsx-sort-props': 'off',

    // Prevent React to be incorrectly marked as unused
    'react/jsx-uses-react': 'error',

    // Prevent variables used in JSX to be incorrectly marked as unused
    'react/jsx-uses-vars': 'error',

    // Prevent usage of dangerous JSX properties
    'react/no-danger': 'off',

    // Prevent usage of setState in componentDidMount
    'react/no-did-mount-set-state': 'error',

    // Prevent usage of setState in componentDidUpdate
    'react/no-did-update-set-state': 'error',

    // Prevent direct mutation of this.state
    'react/no-direct-mutation-state': 'error',

    // Prevent multiple component definition per file
    'react/no-multi-comp': ['error', { ignoreStateless: true }],

    // Prevent usage of setState
    'react/no-set-state': 'off',

    // Make sure we're using valid DOM elements
    'react/no-unknown-property': 'error',

    // Prefer ES2015 Classes for creating React Components
    'react/prefer-es6-class': 'error',

    // Ensure that we have no missing prop validations in a React Component
    'react/prop-types': 'error',

    // Make sure that React is in the scope when JSX is used
    'react/react-in-jsx-scope': 'error',

    // Restrict the file extension
    'react/require-extension': 'off',

    // Enforce additional closing tags when not needed
    'react/self-closing-comp': 'error',

    // Instance-specific methods go after render, truly
    // private (ie' internal) are last
    'react/sort-comp': [
      'error',
      {
        order: ['lifecycle', 'render', '/^_w+$/', '/^__w+$/'],
      },
    ],

    // Prevent missing parentheses around multilines JSX
    'react/jsx-wrap-multilines': 'error',

    // Prevent usage of deprecated methods
    'react/no-deprecated': 'error',
  },
};
