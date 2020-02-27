const axios = require('axios');

const apiBaseUrl =
  process.env.API_BASE_URL || 'https://stupid-brown-camel.gigalixirapp.com';

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
    currentLogin: () => 'patcoll',
    publicTimeline: async (_, args) => {
      // console.log('publicTimeline args', args);

      const response = await axios.get(
        `${apiBaseUrl}/api/v1/timelines/public`,
        { params: args },
      );
      // console.log('response', JSON.stringify(response.data, null, 2));

      // console.log('response.data', response.data);
      return response.data;
      // process.exit(1);
      // return Object.entries(response.data)
      // return response.data.map(status => {
      //   return Object.entries(status);
      // });
    },
    // statuses: () => POSTS.map(mapPost),
  },
  // Status: {
  //   // favouritesCount: (parent, args) => {
  //   //   console.log('parent', parent);
  //   //   console.log('args', args);
  //   //   return parent.favourites_count;
  //   // }
  // },
};
