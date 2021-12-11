const categoryResolver = require("../../graphql/resolvers/category");
const userResolver = require("../../graphql/resolvers/user");
const subCategoryResolver = require("../../graphql/resolvers/subCategory");

module.exports = {
  ...categoryResolver,
  ...userResolver,
  ...subCategoryResolver,
};
