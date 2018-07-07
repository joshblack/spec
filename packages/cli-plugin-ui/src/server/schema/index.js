'use strict';

const { buildSchema } = require('graphql');

const schema = `
type Query {
  project: Project!
  plugins: [Plugin!]!
  tasks: [Task!]!
}

type Project {
  # The name of the folder in the individual's host Operating System
  name: String!

  # The relative path from the individual's $HOME folder to the current project
  relative: String!

  # The full path to the individual's project folder
  path: String!
}

type Plugin {
  name: String!
  options: [Option]!
}

type Option {
  name: String!
  value: String!
}

# A command that can be run by the CLI
type Task {
  # The name of the command
  name: String!
  # The description of the command
  description: String!
}
`;

module.exports = buildSchema(schema);
