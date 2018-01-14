# `@spec/cli`

> A blend of `create-react-app` and `Next.js` to help quickly build
> production-ready, React-based applications.

## Install

```bash
npm init
npm install @spec/cli --save

# Or with yarn
yarn init
yarn add @spec/cli
```

Once Spec is installed, you can use the `init` command to generate your
project's structure. `init` supports a template flag `-t, --template` that
will allow you to specify a template that's most appropriate for your project.

In our case, we'll use the `product` template by running:

```bash
# npm bin expands to the path to our local npm .bin folder
$(npm bin)/spec-cli init --template product
```

When the command finishes running, you should have a project scaffold with a
folder structure similar to the following:

```
.
├── README.md
├── config                   # Config directory for Node.js
│   ├── default.js
│   └── production.js
├── .gitignore
├── public
└── src
    ├── client               # Client-specific code
    │   ├── components
    │   │   └── App.js
    │   ├── index.js
    │   └── styles
    │       └── styles.scss
    └── server               # Server-specific code
        ├── index.js
        └── server.js
```

The `init` commands also updates your `package.json` with a couple of helpful
scripts, namely:

```bash
# Build your project's static assets
spec-cli build

# Run a local server for development
spec-cli dev

# Run the Jest Test-Runner
spec-cli test

# Start a production server, make sure to run spec-cli build first!
spec-cli start
```
