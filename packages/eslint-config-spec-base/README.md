# `eslint-config-spec-base`

> Provides a base set of ESLint rules and plugins to be shared by `@spec/cli` projects.

## Usage

```bash
npm install eslint-config-spec-base --save
# or
yarn add eslint-config-spec-base
```

In addition, `eslint-config-spec-base` requires `eslint` and `eslint-plugin-import` to be installed. You can install the correct versions of each package by running the following command:

```bash
npm info "eslint-config-spec-base@latest" peerDependencies
```

This typically gives you an output like:

```bash
{ eslint: '^3.19.0', 'eslint-plugin-import': '^2.2.0' }
```

Which you can then use like:

```bash
npm i eslint@^3.19.0 eslint-plugin-import@^2.2.0 --save-dev
```

Finally, just add `"extends": "spec-base"` to your `.eslintrc`.

In addition, we also have a sample project available in the `examples` folder of this project.
