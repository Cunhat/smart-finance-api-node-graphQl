const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

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
        type RootQuery {
            category: [String!]!
        }

        type RootMutation {
            createCategory(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      category: () => {
        return ["Sports", "Car"];
      },
      createCategory: (args) => {
        const category = args.name;
        return category;
      },
    },
    graphiql: true,
  })
);

app.listen(8081);
