/* eslint-disable import/no-webpack-loader-syntax */
const { canUseDOM } = require('exenv');
const { mergeSchemas } = require('graphql-tools');
const { resolvers } = require('./resolvers');
const { normalizePath } = require('./util');

let graphql = {};

if (canUseDOM) {
  const typesContext = require.context(
    '!raw-loader!./types',
    true,
    /\.(graphqls|gqls)$/,
  );

  const queriesContext = require.context(
    '!graphql-tag/loader!./queries',
    true,
    /\.(graphql|gql)$/,
  );

  graphql.typeDefs = typesContext
    .keys()
    .map(path => {
      const object = typesContext(path).default;
      return object;
    });

  graphql.queries = queriesContext
    .keys()
    .map(path => {
      const object = queriesContext(path);
      return [normalizePath(path), object];
    });
} else {
  const fs = require('fs');
  const path = require('path');
  const glob = require('glob');
  const gql = require('graphql-tag');

  graphql.typeDefs = glob
    .sync(path.join(__dirname, 'types/**/*'))
    .map(path => {
      const object = fs.readFileSync(path, 'utf8');
      return object;
    });

  graphql.queries = glob
    .sync(path.join(__dirname, 'queries/**/*'))
    .map(path => {
      const normalizedPath = normalizePath(path).replace(/^\/?queries\/?/, '');
      const content = fs.readFileSync(path, 'utf8');
      const doc = gql`
        ${content}
      `;
      return [normalizedPath, doc];
    });
}

graphql.queries = graphql.queries
  .reduce((memo, [key, value]) => {
    memo[key] = value;
    return memo;
  }, {});

graphql.resolvers = resolvers;

const realSchema = mergeSchemas({
  schemas: Object.values(graphql.typeDefs),
  resolvers,
});

// TODO: Mock out everything we haven't defined yet.
// const introspectionQueryResult = graphqlSync(
//   realSchema,
//   introspectionQuery,
// );
// const introspectionSchema = buildClientSchema(introspectionQueryResult.data);
// addMockFunctionsToSchema({ schema: introspectionSchema });
// const schema = mergeSchemas({
//   schemas: [introspectionSchema, realSchema],
// });

graphql.schema = realSchema;

module.exports = graphql;
