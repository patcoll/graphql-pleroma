module.exports = {
  Query: {
    account: async (_, { id }, { axios }) => {
      const response = await axios.get(`/api/v1/accounts/${id}`);
      return response.data;
    },
  },
  Account: {
    statuses: async ({ id }, _, { axios }) => {
      const response = await axios.get(`/api/v1/accounts/${id}/statuses`);
      return response.data;
    },
    followers: async ({ id }, _, { axios }) => {
      const response = await axios.get(`/api/v1/accounts/${id}/followers`);
      return response.data;
    },
  },
};
