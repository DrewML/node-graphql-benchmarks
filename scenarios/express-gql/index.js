const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const app = express();
const typeDefs = `
    input HelloInput {
        value: String!
    }

    type HelloResponse {
        value: String
    }

    type Query {
        hello(input: HelloInput): HelloResponse
    }
`;

const resolvers = {
    Query: {
        hello: async (_, args) => {
            return { value: args.input.value };
        }
    }
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: true,
  }),
);

app.listen(4000);