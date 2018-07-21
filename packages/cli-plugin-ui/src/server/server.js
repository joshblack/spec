'use strict';

const path = require('path');
const express = require('express');
const applyMiddleware = require('@spec/server/tools/applyMiddleware');
const getBuildContext = require('@spec/server/tools/getBuildContext');

const middleware = [
  // Secure middleware for redirecting to HTTPS, when applicable
  require('@spec/server/middleware/secure'),

  // Middleware that should be enabled for most requests
  require('@spec/server/middleware/all'),

  // Development Middleware for handling client-side related development
  require('@spec/server/middleware/development'),

  // "Security" middleware
  require('@spec/server/middleware/security')(),

  // Handle serving static assets provided through ASSET_PATH
  require('@spec/server/middleware/static'),

  require('./middleware/graphql'),

  // Handle generating HTML responses, serving static assets, and error handling
  require('@spec/server/middleware/html')({
    getTitle: () => 'Example Project',
    getMetaTags: () => ({
      og: {
        title: 'Example Project',
        type: 'website',
        description: 'Example Project',
      },
    }),
  }),

  // Error handling so we don't pollute the response with stack traces
  require('@spec/server/middleware/error'),
];

module.exports = async () => {
  const server = express();
  const ASSET_PATH = path.resolve(__dirname, '../../build');
  const context = {
    build: getBuildContext(ASSET_PATH),
  };
  return applyMiddleware(server, middleware, context);
};

// 'use strict';

// const { execSync } = require('child_process');
// const fs = require('fs-extra');
// const path = require('path');
// const express = require('express');
// const { Coordinator } = require('@spec/coordinator');

// const cwd = process.cwd();
// const server = express();

// module.exports = async () => {
// await Coordinator.sync();

// const commands = ['help'];

// commands.forEach(command => {
// server.get(`/commands/${command}`, (req, res) => {
// const stdout = execSync('yarn cli --help', {
// cwd,
// });

// res.json({
// code: 0,
// stderr: null,
// stdout: stdout.toString(),
// });
// });
// });

// server.use((req, res) => {
// res.set('Content-Type', 'text/html');

// const home = path.relative(
// process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
// cwd
// );
// const plugins = Coordinator.plugins.map(({ name, options }) => ({
// name,
// options,
// }));

// res.send(`<!DOCTYPE html>
// <html>
// <head>
// <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono" rel="stylesheet">
// <style>
// html {
// width: 100%;
// height: 100%;
// overflow: hidden;
// }

// body {
// font-family: 'IBM Plex Mono', monospace;
// margin: 0;
// padding: 0;
// width: 100%;
// height: 100%;
// overflow: auto;
// }

// section {
// display: flex;
// }

// section > * {
// flex: 1 1 0%;
// }

// footer {
// position: fixed;
// right: 0;
// bottom: 0;
// left: 0;
// display: flex;
// justify-content: space-between;
// align-items: center;
// height: 2rem;
// background-color: #242424;
// color: #ffffff;
// font-size: 12px;
// padding: 0 0.5rem;
// }

// .tasks {
// padding: 0;
// margin: 0;
// }

// .tasks > li {
// list-style: none;
// }

// .task-output {
// background-color: #242424;
// color: #ffffff;
// min-height: 300px;
// padding: 1rem;
// margin-bottom: 3rem;
// }

// h1 > span {
// font-size: 1rem;
// }
// </style>
// </head>
// <body>
// <h1>
// No fucking way
// <span><em>${path.basename(cwd)}</em></span>
// </h1>
// <section>
// <article>
// <h3>Loaded Plugins</h3>
// <pre><code>${JSON.stringify(plugins, null, 2)}</code></pre>
// </article>
// <article>
// <h3>Run a task</h3>
// <ul class="tasks">
// <li>
// <button id="command--help">Help</button>
// </li>
// </ul>
// <pre class="task-output"><code></code></pre>
// </article>
// </section>
// <footer>
// <div>~/${home}</div>
// </footer>
// <script>
// const help = document.querySelector('#command--help');
// const body = document.querySelector('body');
// const taskOutput = document.querySelector('.task-output > code');

// taskOutput.innerHTML = '# Waiting for a task to run...';

// help.addEventListener('click', async () => {
// taskOutput.innerHTML += '\\n# Running command...';
// const response = await fetch('/commands/help');
// const result = await response.json();
// if (result.code === 0) {
// taskOutput.innerHTML += '\\n' + result.stdout;
// body.scrollTop = body.scrollHeight;
// }
// });
// </script>
// </body>
// </html>
// `);
// });

// return server;
// };
