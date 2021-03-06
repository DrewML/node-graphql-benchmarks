# GraphQL Server Showdown

Load testing various node.js-based solutions for building GraphQL servers.

## Test Plan

For each GraphQL server:

- Every 1 second, add 2 new "users" until 200 users have been added (user == jmeter thread)
- Each user should send the "hello" query as many times as it possibly can over the same HTTP/1.1 connection
- Let test run for 2 minutes - 100 seconds ramping up users, and 20 seconds of all 200 users hammering.

This plan is meant to closely mimic a flood of users coming to a site, and hammering the server via something like a search field with aggressive search suggestions (if you think this is contrived, good search ahead implementions request results for every key stroke).

Note that we're using the same query for every request, because we're not trying to measure how long it takes the [`graphql-js`](https://github.com/graphql/graphql-js) parser or validator to run. We really just want to know what the framework-specific overhead is for each option.

### Schema

```graphql
input HelloInput {
  value: String!
}

type HelloResponse {
  value: String
}

type Query {
  hello(input: HelloInput): HelloResponse
}
```

### Query

```graphql
query {
  hello(input: { value: "world" }) {
    value
  }
}
```

## Setup

1. Install [`JMeter`](https://jmeter.apache.org/) (must have Java 8 or higher)
2. Run `npm install`

## Running

Run `./bench`

## Viewing Detailed Results

After running, see `html-report/index.html` within each subdirectory in `scenarios`

## Recent Reports (Feb 26, 2020)

### Baseline

The baseline measurements are meant to give a rough idea of what our node.js-based servers are capable of _without_ GraphQL. These demo apps accept a `POST` at `/graphql`, but just have a hard-coded return payload. No parsing, no validation, no query execution.

| Libraries            | Peak Transactions | Average Response Time | Max Response Time | Notes |
| -------------------- | ----------------- | --------------------- | ----------------- | ----- |
| Express (no GraphQL) | 11,157/s          | 10.57ms               | 72ms              |       |
| Fastify (no GraphQL) | 13,837.83/s       | 8.50ms                | 76ms              |       |

### Results

| Libraries                             | Peak Transactions | Average Response Time | Max Response Time | Notes                                                                                             |
| ------------------------------------- | ----------------- | --------------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| apollo-server                         | 4315.97/s         | 27.88ms               | 180ms             |                                                                                                   |
| apollo-server + graphql-jit           | 4618/s            | 25.83ms               | 239ms             |                                                                                                   |
| express-graphql                       | 81/s              | 1059.14ms             | 7357ms            | Lots of JMeter thread crashes, consistently. Suspect too much buffering. Never exceeded 130 users |
| fastify + apollo-server-fastify       | 5619/s            | 21.66ms               | 140ms             |                                                                                                   |
| fastify + apollo-server-fastify + jit | 6271/s            | 19.33ms               | 139ms             |                                                                                                   |
| fastify + fastify-gql (jit enabled)   | 13,411/s          | 8.69ms                | 109ms             |                                                                                                   |
| fastify + fastify-gql (jit disabled)  | 10,461/s          | 11.15ms               | 84ms              |                                                                                                   |

## Thoughts

- Good defaults matter
- Should try adding [validation caching](https://github.com/graphql/express-graphql/issues/474) to `express-graphql` to speed it up

## Related

- https://github.com/benawad/node-graphql-benchmarks
