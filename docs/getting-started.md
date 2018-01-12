# Getting Started

> Up & Running with Ocelot.

## Install

Make sure to follow [Whitewater's instructions](https://github.ibm.com/Whitewater/npm-enterprise) for npm Enterprise and have an alias for the `@ocelot` scope that is mapped to the npm Enterprise registry.

For reference, this should look like `@ocelot:registry=https://npm-registry.whitewater.ibm.com/` and is located in your `~/.npmrc` file.

Afterwards, you can run the following to initialize a project with Ocelot:

```bash
npm init
npm install @ocelot/ocelot --save --registry=https://npm-registry.whitewater.ibm.com/

# Or with yarn
yarn init
yarn add @ocelot/ocelot --registry=https://npm-registry.whitewater.ibm.com/
```

Once Ocelot is installed, you can use the `init` command to generate your
project's structure. `init` supports a template flag `-t, --template` that
will allow you to specify a template that's most appropriate for your project.

In our case, we'll use the `watson` template by running:

```bash
# npm bin expands to the path to our local npm .bin folder
$(npm bin)/ocelot init --template watson
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
ocelot build

# Run a local server for development
ocelot dev

# Run the Jest Test-Runner
ocelot test

# Start a production server, make sure to run ocelot build first!
ocelot start
```
