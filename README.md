This is an unofficial Next.js 12 integration for Apollo Server V4. **It is early work and has not been extensively tested in production.**

Apollo Server is a community-maintained open-source GraphQL server that works with many Node.js HTTP server frameworks. [Read the docs](https://www.apollographql.com/docs/apollo-server/v2). [Read the CHANGELOG](https://github.com/apollographql/apollo-server/blob/main/CHANGELOG.md).

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
