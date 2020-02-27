const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware')

const snakeCase = require('lodash.snakecase');

function hasUppercase(string) {
  for (let i = 0; i < string.length; i++) {
    let ch = string.charCodeAt(i);
    if (ch >= 65 && ch <= 90) {
      return true;
    }
  }
  return false;
}

/**
 * By default, resolve data as `snake_case` instead of `camelCase` from
 * data that is returned from resolvers.
 */
const snakeCaseFieldResolver = async (resolve, source, args, context, info) => {
  // console.log('source', source);
  // console.log('info', info);

  if (source && hasUppercase(info.fieldName)) {
    const converted = snakeCase(info.fieldName);
    if (typeof source[converted] !== 'undefined') {
      return source[converted];
    }
  }

  return await resolve(source, args, context, info);
};

/**
 * By default, convert the keys of any arguments into `snake_case`.
 */
const snakeCaseArgsResolver = async (resolve, source, args, context, info) => {
  // console.log('source', source);
  // console.log('info', info);

  if (Object.keys(args).some(hasUppercase)) {
    args = Object.entries(args)
      .map(([key, value]) => [snakeCase(key), value])
      .reduce((memo, entry) => {
        memo[entry[0]] = entry[1];
        return memo;
      }, {});
    // console.log('snakeCaseArgsResolver args', args);
  }
  // if (source) {
  //   const converted = snakeCase(info.fieldName);
  //   if (typeof source[converted] !== 'undefined') {
  //     return source[converted];
  //   }
  // }

  return await resolve(source, args, context, info);
};

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
const { schema } = graphql;

const schemaWithMiddleware = applyMiddleware(
  schema,
  // logInput,
  snakeCaseFieldResolver,
  snakeCaseArgsResolver,
  // logResult,
)

const app = express();

const server = new ApolloServer({
  cors: false,
  schema: schemaWithMiddleware,
  // fieldResolver: snakeCaseFieldResolver,
  // debug: true,
  // tracing: true,
});

const path = '/graphql';
server.applyMiddleware({ app, path });

const port = process.env.PORT || 4000;

app.listen(port);

console.log(`Running a GraphQL API server at localhost:${port}${path}`);
