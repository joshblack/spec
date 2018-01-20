# `spec` [![Build Status](https://travis-ci.org/joshblack/spec.svg?branch=master)](https://travis-ci.org/joshblack/spec)

> Packages for building robust, production-ready React UIs

## Usage

You can see all the packages that `spec` publishes
[here](https://www.npmjs.com/org/spec). However, for most you'll want to
specifically use `@spec/cli` to get up and running.

The easiet way to use `@spec/cli` is to create your project by doing the
following:

```bash
npx @spec/cli init <folder>
```

*([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)
comes with npm 5.2+ and higher*

The CLI will automatically create all the files needed in the given folder.
You can see all the options available for the `init` command by doing:

```bash
npx @spec/cli init --help
```

After the CLI creates your folder, you'll have a variety of commands available
to you from your `package.json` file. For example, by default you'll have
commands like `dev`, `test`, and `build` that you can use to get up and running
with development.

### Templates

One of the cool parts about `@spec/cli init` is that you can pass in a `-t,
--template` flag that the CLI can use to modify what ends up being created. The
default template is [`@spec/template-product`](https://github.com/joshblack/spec/tree/master/packages/spec-template-product),
or just `-t product`, and it creates an opinionated folder structure for
React.js-based UIs served with Express.

## Contributing

We'd love to have your help building `spec`! See [CONTRIBUTING.md](CONTRIBUTING.md)
for more information on what we're looking for and how to get started.
