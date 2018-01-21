# `e2e`

> Folder responsible for configuration of the environment needed to run e2e
> tests for the `@spec` project

## Running

In order to run the project's e2e tests, namely `tasks/installs.sh`, in a way
that doesn't disrupt your environment, you'll need to leverage `docker` and
`docker-compose`.

In this folder, we have both defined. `docker-compose` is used to orchestrate
the local NPM registry connection while the `Dockerfile` is used to setup our
test environment in a container that we can build during CI.

To run any of the tasks needed for our e2e tests, all you need to do is the
following:

```bash
# Stop any currently running services, removing their volumes as well so that we
# have idempotent builds
docker-compose -f e2e/docker-compose.yml down -v

# Build relevant Dockerfile
docker-compose -f e2e/docker-compose.yml build

# Run a task, by default the command given to `docker-compose run` will be
# relative to the root directory.
docker-compose run test ./tasks/installs.sh
```
