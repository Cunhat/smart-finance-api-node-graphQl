const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema");
const graphQlResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    app.listen(process.env.PORT || 8081);
  })
  .catch((err) => {
    console.error(err);
  });
