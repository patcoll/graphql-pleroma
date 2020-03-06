const POSTS = {
  'd4d5f001-0174-4473-9a51-4ffa5b2d91f6': {
    author: 'John Doe',
    body: 'Hello world',
  },
  '43e53859-5e58-4ce0-833d-9583349f13a3': {
    author: 'Jane Doe',
    body: 'Hi, planet!',
  },
};

const mapPost = (post, id) => post && { id, ...post };

module.exports = {
  Query: {
    posts: () => {
      return Object.entries(POSTS).map(([id, post]) => mapPost(post, id));
    },
    post: (_, { id }) => mapPost(POSTS[id], id),
  },
};
