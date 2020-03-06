const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware')
const camelCaseKeys = require('camelcase-keys');
const snakeCaseKeys = require('snakecase-keys');
const axios = require('axios');
const flag = require('node-env-flag');

const apiBaseUrl =
  process.env.API_BASE_URL || 'https://stupid-brown-camel.gigalixirapp.com';

const debugMiddleware = flag(process.env.DEBUG_MIDDLEWARE, false);
const debugServer = flag(process.env.DEBUG_SERVER, false);

/**
 * By default, convert the keys of any arguments into `snake_case`.
 */
const snakeCaseArgsResolver = async (resolve, source, args, context, info) => {
  if (Object.keys(args).length) {
    args = snakeCaseKeys(args);
    console.log('snakeCaseArgsResolver args', args);
  }

  return await resolve(source, args, context, info);
};

/**
 * Keeping this middleware around for debugging purposes.
 */
const logInput = async (resolve, root, args, context, info) => {
  console.log(`1. logInput: ${JSON.stringify(args)}`)
  const result = await resolve(root, args, context, info)
  console.log(`5. logInput`)
  return result
}

const logResult = async (resolve, root, args, context, info) => {
  console.log(`2. logResult`)
  const result = await resolve(root, args, context, info)
  console.log(`4. logResult: ${JSON.stringify(result)}`)
  return result
}

const graphql = require('../graphql');
const { schema: rawSchema } = graphql;

const middlewareArgs = [
  rawSchema,
  debugMiddleware ? logInput : null,
  snakeCaseArgsResolver,
  debugMiddleware ? logResult : null,
].filter(Boolean);

const schema = applyMiddleware(...middlewareArgs);

const app = express();

const server = new ApolloServer({
  cors: false, // TODO: Don't need this in testing, but might later.
  schema,
  context: () => {
    const instance = axios.create({
      baseURL: apiBaseUrl,
      transformResponse: axios.defaults.transformResponse.concat(function (data, headers) {
        return camelCaseKeys(data, { deep: true });
      }),
    });

    return {
      axios: instance,
    };
  },
  debug: debugServer,
  tracing: false,
});

const path = '/graphql';
server.applyMiddleware({ app, path });

const port = process.env.PORT || 4000;

app.listen({ port }, () => {
  console.log(`Running a GraphQL API server at localhost:${port}${path}`);
});

