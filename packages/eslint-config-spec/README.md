# `@watson/eslint-config-watson`

> Provides a set of ESLint rules and plugins to be shared by IBM Watson projects.

## Usage

Make sure to follow [Whitewater's instructions](https://github.ibm.com/Whitewater/npm-enterprise) for npm Enterprise and have an alias for the `@watson` scope that is mapped to the npm Enterprise registry.

For reference, this should look like `@watson:registry=https://npm-registry.whitewater.ibm.com/` and is located in your `~/.npmrc` file.

### `@watson/eslint-config-watsonn`

Our default export contains all of our ESLint rules, including ECMAScript ES2015+ and React. It requires `eslint`, `eslint-plugin-import`, `eslint-plugin-react`, and `eslint-plugin-jsx-a11y`. By default, you can add this package to your project by running the following command:

```bash
npm i @watson/eslint-config-watson --save-dev
```

You can install the correct versions of each peer Dependency by running the following command:

```bash
npm info "@watson/eslint-config-watson@latest" peerDependencies
```

This typically gives you an output like:

```bash
{ eslint: '^3.19.0', 'eslint-plugin-import': '^2.2.0', 'eslint-plugin-jsx-a11y': '^4.0.0', 'eslint-plugin-react', '^6.10.3' }
```

Which you can then use like:

```bash
npm i eslint@^3.19.0 eslint-plugin-import@^2.2.0 eslint-plugin-jsx-a11y@^4.0.0 eslint-plugin-react@^6.10.3 --save-dev
```

Finally, just add `"extends": "@watson/watson"` to your `.eslintrc`.
