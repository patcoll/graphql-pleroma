function normalizePath(path) {
  let normalizedPath = path
    .replace(/^\.\//, '')
    .replace(/\.(js|graphqls?|gqls?)$/i, '');
  if (normalizedPath.indexOf(__dirname) === 0) {
    normalizedPath = normalizedPath.slice(__dirname.length);
  }
  return normalizedPath;
}

module.exports = {
  normalizePath,
};
