# Roadmap

- [ ] Projects
  - [ ] Use a `create` command to scaffold out a project
    - [ ] From the name of a package on public `npm`
    - [ ] From the name of a package on artifactory
    - [ ] From the URL of a package on public GitHub
    - [ ] From the URL of a package on GitHub enterprise
    - [ ] From the path of a local package
  - [ ] Add a plugin using the `add` command
  - [ ] Update a plugin using the `upgrade` command
  - [ ] Remove a plugin using the `remove` command
- [ ] Plugins
  - [x] Can be customized through options in a `spec.config.js` file
  - [x] Can define a store for other plugins to read/write to
- [ ] Coordinator
  - [x] Can read from local plugins
  - [x] Can read from remote plugins
