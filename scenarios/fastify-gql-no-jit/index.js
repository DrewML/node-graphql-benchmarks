const fastify = require('fastify')();
const gql = require('fastify-gql');

const schema = `
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
        hello: async (_, args, ...args1) => {
            return { value: args.input.value };
        }
    }
};


fastify.register(gql, {
    schema,
    resolvers,
    graphiql: true,
    path: '/graphql',
    jit: 0
});

fastify.listen(4000).then(() => {
    const { address, port } = fastify.server.address();
    console.log(`Server running at: http://${address}:${port}`);
}).catch(err => {
    console.error(err);
    process.exit();
});