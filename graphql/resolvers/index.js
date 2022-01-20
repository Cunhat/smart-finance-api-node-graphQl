const categoryResolver = require("../../graphql/resolvers/category");
const userResolver = require("../../graphql/resolvers/user");
const subCategoryResolver = require("../../graphql/resolvers/subCategory");
const transactionResolver = require("../../graphql/resolvers/transaction");
const authResolver = require("./auth")

module.exports = {
  ...categoryResolver,
  ...userResolver,
  ...subCategoryResolver,
  ...transactionResolver,
  ...authResolver
};
