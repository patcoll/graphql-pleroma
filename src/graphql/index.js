/* eslint-disable import/no-webpack-loader-syntax */
const { canUseDOM } = require('exenv');
const {
  mergeSchemas,
  addResolveFunctionsToSchema,
} = require('graphql-tools');
const resolvers = require('./resolvers');

function normalizePath(path) {
  let normalizedPath = path
    .replace(/^\.\//, '')
    .replace(/\.(graphqls?|gqls?)$/i, '');
  if (normalizedPath.indexOf(__dirname) === 0) {
    normalizedPath = normalizedPath.slice(__dirname.length);
  }
  return normalizedPath;
}

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
      return [normalizePath(path), object];
    })
    .reduce((memo, entry) => {
      memo[entry[0]] = entry[1];
      return memo;
    }, {});

  graphql.queries = queriesContext
    .keys()
    .map(path => {
      const object = queriesContext(path);
      return [normalizePath(path), object];
    })
    .reduce((memo, entry) => {
      memo[entry[0]] = entry[1];
      return memo;
    }, {});
} else {
  const fs = require('fs');
  const path = require('path');
  const glob = require('glob');
  const gql = require('graphql-tag');

  graphql.typeDefs = glob
    .sync(path.join(__dirname, 'types/**/*'))
    .map(path => {
      const normalizedPath = normalizePath(path).replace(/^\/?types\/?/, '');
      const object = fs.readFileSync(path, 'utf8');
      return [normalizedPath, object];
    })
    .reduce((memo, entry) => {
      memo[entry[0]] = entry[1];
      return memo;
    }, {});

  graphql.queries = glob
    .sync(path.join(__dirname, 'queries/**/*'))
    .map(path => {
      const normalizedPath = normalizePath(path).replace(/^\/?queries\/?/, '');
      const content = fs.readFileSync(path, 'utf8');
      const doc = gql`
        ${content}
      `;
      return [normalizedPath, doc];
    })
    .reduce((memo, entry) => {
      memo[entry[0]] = entry[1];
      return memo;
    }, {});
}

graphql.schema = mergeSchemas({
  schemas: Object.values(graphql.typeDefs),
});

addResolveFunctionsToSchema({
  schema: graphql.schema,
  resolvers,
});

module.exports = graphql;
