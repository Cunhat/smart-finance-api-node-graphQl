const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Category = require("./models/category");
const User = require("./models/user");
const SubCategory = require("./models/subCategory");
const Transaction = require("./models/transaction");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Category {
          _id: ID!
          name: String!
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
    `),
    rootValue: {
      category: () => {
        return Category.find()
          .then((results) => {
            return results.map((category) => {
              return { ...category._doc, _id: category.id.toString() };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createCategory: (args) => {
        const newCategory = new Category({
          name: args.categoryInput.name,
        });
        return newCategory
          .save()
          .then((result) => {
            return { ...result._doc, _id: result.id.toString() };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      user: () => {
        return User.find().then((results) => {
          return results.map((user) => {
            return { ...user._doc, password: "", _id: user.id.toString() };
          });
        });
      },
      createUser: (args) => {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then((hashedPassword) => {
            const newUser = new User({
              name: args.userInput.name,
              email: args.userInput.email,
              password: hashedPassword,
            });
            return newUser.save();
          })
          .then((result) => {
            console.log(result);
            return {
              ...result._doc,
              password: "",
              _id: result.id.toString(),
            };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://admin:admin@cluster0.a35sh.mongodb.net/smart-finance?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8081);
  })
  .catch((err) => {
    console.error(err);
  });
