const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Category = require("./models/category");

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

        input CategoryInput {
          name: String!
        }

        type RootQuery {
            category: [Category!]!
        }

        type RootMutation {
            createCategory(categoryInput: CategoryInput): Category
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
