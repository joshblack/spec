FROM node:9.4
MAINTAINER joshblack@us.ibm.com

RUN mkdir -p /spec
WORKDIR /spec

COPY .dockerignore \
  .editorconfig \
  .eslintignore \
  .gitignore \
  .prettierignore \
  .travis.yml \
  .yarnrc \
  CHANGELOG.md \
  lerna.json \
  LICENSE \
  package.json \
  README.md \
  yarn.lock \
  ./
COPY packages ./packages
RUN yarn

COPY .git ./.git
COPY .github ./.github
COPY docs ./docs
COPY e2e ./e2e
COPY tasks ./tasks
