const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Category {
  _id: ID!
  name: String!
  user: User!
}

type SubCategory {
  _id: ID!
  name: String!
}

type User {
  _id: ID!
  name: String!
  email: String!
  password: String!
  categories: [Category!]
}

type Transaction {
  _id: ID!
  name: String!
  value: Float!
  date: String!
}
  

input CategoryInput {
  name: String!
}

input SubCategoryInput {
  name: String!
}

input UserInput {
  name: String!
  email: String!
  password: String!
}

input TransactionInput {
  name: String!
  value: Float!
  date: String!
}

type RootQuery {
    category: [Category!]!
    subCategory: [SubCategory!]!
    user: [User!]!
    transaction: [Transaction!]!
}

type RootMutation {
    createCategory(categoryInput: CategoryInput): Category
    createSubCategory(subCategoryInput: SubCategoryInput): SubCategory
    createUser(userInput: UserInput): User
    createTransaction(transactionInput: TransactionInput): Transaction
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
