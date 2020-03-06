module.exports = {
  Query: {
    publicTimeline: async (_, args, { axios }) => {
      const response = await axios.get(`/api/v1/timelines/public`, {
        params: args,
      });
      return response.data;
    },
  },
};
