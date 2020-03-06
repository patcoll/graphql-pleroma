const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware')
// const snakeCase = require('lodash.snakecase');
const camelCaseKeys = require('camelcase-keys');
const snakeCaseKeys = require('snakecase-keys');
const axios = require('axios');

const apiBaseUrl =
  process.env.API_BASE_URL || 'https://stupid-brown-camel.gigalixirapp.com';

// function hasUppercase(string) {
//   for (let i = 0; i < string.length; i++) {
//     let ch = string.charCodeAt(i);
//     if (ch >= 65 && ch <= 90) {
//       return true;
//     }
//   }
//   return false;
// }

/**
 * By default, resolve data as `snake_case` instead of `camelCase` from
 * data that is returned from resolvers.
 */
// const snakeCaseFieldResolver = async (resolve, source, args, context, info) => {
//   if (source && hasUppercase(info.fieldName)) {
//     const converted = snakeCase(info.fieldName);
//     if (typeof source[converted] !== 'undefined') {
//       return source[converted];
//     }
//   }
//
//   return await resolve(source, args, context, info);
// };

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

// const logInput = async (resolve, root, args, context, info) => {
//   console.log(`1. logInput: ${JSON.stringify(args)}`)
//   const result = await resolve(root, args, context, info)
//   console.log(`5. logInput`)
//   return result
// }

// const logResult = async (resolve, root, args, context, info) => {
//   console.log(`2. logResult`)
//   const result = await resolve(root, args, context, info)
//   console.log(`4. logResult: ${JSON.stringify(result)}`)
//   return result
// }

const graphql = require('../graphql');
const { schema: rawSchema } = graphql;

const schema = applyMiddleware(
  rawSchema,
  // logInput,
  // snakeCaseFieldResolver,
  snakeCaseArgsResolver,
  // logResult,
)

const app = express();

const server = new ApolloServer({
  cors: false, // TODO: change
  schema,
  context: () => {
    const instance = axios.create({
      baseURL: apiBaseUrl,
      // timeout: 1000,
      // headers: {},
      transformResponse: axios.defaults.transformResponse.concat(function (data, headers) {
        data = camelCaseKeys(data, { deep: true });
        // console.log('data', data);
        return data;
      }),
    });

    return {
      axios: instance,
    };
  },
  // debug: true,
  // tracing: true,
});

const path = '/graphql';
server.applyMiddleware({ app, path });

const port = process.env.PORT || 4000;

app.listen({ port }, () => {
  console.log(`Running a GraphQL API server at localhost:${port}${path}`);
});

