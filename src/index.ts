import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type {
  ApolloServer,
  BaseContext,
  ContextFunction,
  HTTPGraphQLRequest,
} from "@apollo/server";
import type { WithRequired } from "@apollo/utils.withrequired";

import { parse as urlParse } from "url";

export interface NextContextFunctionArgument {
  req: NextApiRequest;
  res: NextApiResponse;
}

export interface NextHandlerOptions<TContext extends BaseContext> {
  context?: ContextFunction<[NextContextFunctionArgument], TContext>;
}

export function nextHandler(
  server: ApolloServer<BaseContext>,
  options?: NextHandlerOptions<BaseContext>
): NextApiHandler;
export function nextHandler<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options: WithRequired<NextHandlerOptions<TContext>, "context">
): NextApiHandler;
export function nextHandler<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options?: NextHandlerOptions<TContext>
): NextApiHandler {
  server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

  // This `any` is safe because the overload above shows that context can
  // only be left out if you're using BaseContext as your context, and {} is a
  // valid BaseContext.
  const defaultContext: ContextFunction<
    [NextContextFunctionArgument],
    any
  > = async () => ({});

  const contextFunction: ContextFunction<
    [NextContextFunctionArgument],
    TContext
  > = options?.context ?? defaultContext;

  return async function (req, res) {
    const headers = new Map<string, string>();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        // Node/Express headers can be an array or a single value. We join
        // multi-valued headers with `, ` just like the Fetch API's `Headers`
        // does. We assume that keys are already lower-cased (as per the Node
        // docs on IncomingMessage.headers) and so we don't bother to lower-case
        // them or combine across multiple keys that would lower-case to the
        // same value.
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    if (!req.method) {
      res.status(500);
      res.send("`req.method` is not set");
      return;
    }

    const httpGraphQLRequest: HTTPGraphQLRequest = {
      method: req.method.toUpperCase(),
      headers,
      search: urlParse(req.url || "").search ?? "",
      body: req.body,
    };

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: () => contextFunction({ req, res }),
    });

    for (const [key, value] of httpGraphQLResponse.headers) {
      res.setHeader(key, value);
    }
    res.status(httpGraphQLResponse.status || 200);

    if (httpGraphQLResponse.body.kind === "complete") {
      res.send(httpGraphQLResponse.body.string);
      return;
    }

    for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
      res.write(chunk);
    }
    res.end();
  };
}
