const { canUseDOM } = require('exenv');
const path = require('path');
const glob = require('glob');

let resolvers = [];

if (canUseDOM) {
  const resolversContext = require.context(
    './resolvers',
    true,
    /\.js$/,
  );

  resolvers = resolversContext
    .keys()
    .map(path => resolversContext(path));
  console.log('resolvers', resolvers);
} else {
  resolvers = glob
    .sync(path.join(__dirname, 'resolvers/**/*.js'))
    .map(path => require(path));
}

module.exports = {
  resolvers,
};
