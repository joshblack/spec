FROM node:9.4
MAINTAINER joshblack@us.ibm.com

RUN mkdir -p /spec
WORKDIR /spec

COPY . .

ENTRYPOINT ["/spec/e2e/installs.sh"]
