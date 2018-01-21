FROM node:9.4
MAINTAINER joshblack@us.ibm.com

RUN mkdir -p /spec
WORKDIR /spec

COPY .git ./.git
COPY package.json lerna.json yarn.lock ./
COPY packages ./packages
RUN yarn

COPY tasks ./tasks
COPY e2e ./e2e
