<!-- [![npm version](https://badge.fury.io/js/apollo-server-lambda.svg)](https://badge.fury.io/js/apollo-server-lambda)
[![Build Status](https://circleci.com/gh/apollographql/apollo-server/tree/main.svg?style=svg)](https://circleci.com/gh/apollographql/apollo-server)
[![Join the community forum](https://img.shields.io/badge/join%20the%20community-forum-blueviolet)](https://community.apollographql.com)
[![Read CHANGELOG](https://img.shields.io/badge/read-changelog-blue)](https://github.com/apollographql/apollo-server/blob/HEAD/CHANGELOG.md) -->

This is a Next.js 12 integration of GraphQL Server. **It is early work and has not been extensively tested in production.**

It is based on [samples provided by @glasser](https://github.com/vercel/next.js/pull/30082) and the official [apollo-server-lambda](http://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-lambda) integration.

Apollo Server is a community-maintained open-source GraphQL server that works with many Node.js HTTP server frameworks. [Read the docs](https://www.apollographql.com/docs/apollo-server/v2). [Read the CHANGELOG](https://github.com/apollographql/apollo-server/blob/main/CHANGELOG.md).

## Getting Started

This section assumes that you already have a running Next.js project.

```shell
npm install apollo-server-nextjs graphql
```

Create a file named `pages/api/graphql.js`, place the following code:

```js
import { ApolloServer, gql } from "apollo-server-nextjs";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // install the Playground plugin and set the `introspection` option explicitly to `true`.
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export default server.createHandler();

// Disable Next.js body parsing so that Apollo Server can access it entirely
export const config = {
  api: {
    bodyParser: false,
  },
};
```

Then open http://localhost:3000/api/graphql

<!-- Needs update for Nextjs
## Getting request info



Your ApolloServer's `context` function can read information about the current operation from both the original Lambda data structures and the Express request and response created by `@vendia/serverless-express`. These are provided to your `context` function as `event`, `context`, and `express` options.

The `event` object contains the API Gateway event (HTTP headers, HTTP method, body, path, ...). The `context` object (not to be confused with the `context` function itself!) contains the current Lambda Context (Function Name, Function Version, awsRequestId, time remaining, ...). `express` contains `req` and `res` fields with the Express request and response. The object returned from your `context` function is provided to all of your schema resolvers in the third `context` argument.

```js
const { ApolloServer, gql } = require("apollo-server-lambda");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context, express }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    expressRequest: express.req,
  }),
});

exports.graphqlHandler = server.createHandler();
```
-->

## Modifying the Response (Enable CORS)

To enable CORS the response HTTP headers need to be modified. To accomplish this use the `cors` option.

```js
import { ApolloServer, gql } from "apollo-server-lambda";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: "*",
      credentials: true,
    },
  },
});
```

To enable CORS response for requests with credentials (cookies, http authentication) the allow origin header must equal the request origin and the allow credential header must be set to true.

```js
import { ApolloServer, gql } from "apollo-server-lambda";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: true,
      credentials: true,
    },
  },
});
```

### Cors Options

The options correspond to the [express cors configuration](https://github.com/expressjs/cors#configuration-options) with the following fields(all are optional):

- `origin`: boolean | string | string[]
- `methods`: string | string[]
- `allowedHeaders`: string | string[]
- `exposedHeaders`: string | string[]
- `credentials`: boolean
- `maxAge`: number

## Principles

GraphQL Server is built with the following principles in mind:

- **By the community, for the community**: GraphQL Server's development is driven by the needs of developers
- **Simplicity**: by keeping things simple, GraphQL Server is easier to use, easier to contribute to, and more secure
- **Performance**: GraphQL Server is well-tested and production-ready - no modifications needed

Anyone is welcome to contribute to GraphQL Server, just read [CONTRIBUTING.md](https://github.com/apollographql/apollo-server/blob/main/CONTRIBUTING.md), take a look at the [roadmap](https://github.com/apollographql/apollo-server/blob/main/ROADMAP.md) and make your first PR!
