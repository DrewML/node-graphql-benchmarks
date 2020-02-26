const fastify = require('fastify')();
const { ApolloServer, gql } = require('apollo-server-fastify');

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
fastify.register(server.createHandler());

fastify.listen(4000).then(() => {
    const { address, port } = fastify.server.address();
    console.log(`Server running at: http://${address}:${port}`);
}).catch(err => {
    console.error(err);
    process.exit();
});