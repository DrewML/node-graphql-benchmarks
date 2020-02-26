const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
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

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`Server running at: ${url}`);
}).catch(err => {
    console.error(err);
    process.exit();
});