FROM node:6
ADD . /
VOLUME ./src:/src
VOLUME ./dist:/dist
WORKDIR .
RUN npm install -g horizon
CMD ["hz", "serve", "--dev", "-c", "rethinkdb:28015", "--debug", "yes",  "--bind", "all"]
