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
  user: User!
}

type User {
  _id: ID!
  name: String!
  email: String!
  password: String!
  categories: [Category!]
  subCategories: [SubCategory!]
  transactions: [Transaction!]
}

type Transaction {
  _id: ID!
  name: String!
  value: Float!
  date: String!
  category: Category!
  subCategory: SubCategory!
  user: User!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
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
  category: ID!
  subCategory: ID!
}

input UpdateCategoryInput {
  name: String!
  id: ID!
}
input UpdateSubCategoryInput {
  name: String!
  id: ID!
}

type RootQuery {
    category: [Category!]!
    subCategory: [SubCategory!]!
    user: [User!]!
    transaction: [Transaction!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createCategory(categoryInput: CategoryInput): Category
    createSubCategory(subCategoryInput: SubCategoryInput): SubCategory
    createUser(userInput: UserInput): User
    createTransaction(transactionInput: TransactionInput): Transaction
    updateCategory(updateCategoryInput: UpdateCategoryInput): Category
    updateSubCategory(updateSubCategoryInput: UpdateSubCategoryInput): SubCategory
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
