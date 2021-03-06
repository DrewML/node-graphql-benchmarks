const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server');
const LRU = require('tiny-lru');
const {
    compileQuery,
    isCompiledQuery
}  = require('graphql-jit');

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

// https://github.com/zalando-incubator/graphql-jit/blob/098c1c202e27376526982489e8dacaff42fbc338/examples/blog-apollo-server/src/executor.ts
const makeExecutor = (
    schema,
    cacheSize = 1024,
    compilerOpts = {}
  ) => {
    const cache = LRU(cacheSize);
    return async ({ context, document, operationName, request, queryHash }) => {
      const prefix = operationName || "NotParametrized";
      const cacheKey = `${prefix}-${queryHash}`;
      let compiledQuery = cache.get(cacheKey);
      if (!compiledQuery) {
        const compilationResult = compileQuery(schema, document, operationName || undefined, compilerOpts);
        if (isCompiledQuery(compilationResult)) {
          compiledQuery = compilationResult;
          cache.set(cacheKey, compiledQuery);
        } else {
          // ...is ExecutionResult
          return compilationResult;
        }
      }
      return compiledQuery.query(undefined, context, request.variables || {});
    };
  };

const resolvers = {
    Query: {
        hello: async (_, args) => {
            return { value: args.input.value };
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
    schema,
    executor: makeExecutor(schema)
});
server.listen().then(({ url }) => {
    console.log(`Server running at: ${url}`);
}).catch(err => {
    console.error(err);
    process.exit();
});