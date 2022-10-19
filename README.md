This is an unofficial Next.js 12 integration for Apollo Server 4. **It is early work and has not been extensively tested in production.**

If you are using **Apollo Server 3**, please see [notes below](#apollo-server-3).

Apollo Server is a community-maintained open-source GraphQL server that works with many Node.js HTTP server frameworks. [Read the docs](https://www.apollographql.com/docs/apollo-server).

## Getting Started

This section assumes that you already have a running Next.js project.

```shell
npm install @apollo/server graphql apollo-server-nextjs@next
```

Create a file named `pages/api/graphql.js`, place the following code:

```js
import { ApolloServer } from "@apollo/server";
import { nextHandler } from "apollo-server-nextjs";

// Construct a schema, using GraphQL schema language
const typeDefs = `#graphql
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

export default nextHandler(server);
```

Then open http://localhost:3000/api/graphql

## Apollo Server 3

This package was available for Apollo Server 3.

If you need support for **Apollo Server 3**, please use `apollo-server-nextjs@legacy` instead of `apollo-server-nextjs` when installing dependencies:

```shell
npm install apollo-server-nextjs@legacy graphql
```

Then, refer to [past documentation](https://github.com/apuyou/apollo-server-nextjs/blob/562852ae476a5db19e96d81b2f8f242ea77cc10e/README.md).
