# `@watson/eslint-config-watson-base`

> Provides a base set of ESLint rules and plugins to be shared by IBM Watson projects.

## Usage

Make sure to follow [Whitewater's instructions](https://github.ibm.com/Whitewater/npm-enterprise) for npm Enterprise and have an alias for the `@watson` scope that is mapped to the npm Enterprise registry.

For reference, this should look like `@watson:registry=https://npm-registry.whitewater.ibm.com/` and is located in your `~/.npmrc` file.

```bash
npm install @watson/eslint-config-watson-base --save
# or
yarn add @watson/eslint-config-watson-base
```

In addition, `eslint-config-watson-base` requires `eslint` and `eslint-plugin-import` to be installed. You can install the correct versions of each package by running the following command:

```bash
npm info "@watson/eslint-config-watson-base@latest" peerDependencies
```

This typically gives you an output like:

```bash
{ eslint: '^3.19.0', 'eslint-plugin-import': '^2.2.0' }
```

Which you can then use like:

```bash
npm i eslint@^3.19.0 eslint-plugin-import@^2.2.0 --save-dev
```

Finally, just add `"extends": "@watson/watson-base"` to your `.eslintrc`.

In addition, we also have a sample project available in the `examples` folder of this project.
