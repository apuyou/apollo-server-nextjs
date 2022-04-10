import {
  ApolloServer as ApolloServerExpress,
  GetMiddlewareOptions,
} from "apollo-server-express";
import type express from "express";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export interface CreateHandlerOptions {
  expressGetMiddlewareOptions?: GetMiddlewareOptions;
}

export interface NextContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    next(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export class ApolloServer extends ApolloServerExpress<NextContext> {
  protected override serverlessFramework(): boolean {
    return true;
  }

  public createHandler(options?: CreateHandlerOptions): NextApiHandler {
    let middleware: express.Router;
    return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      await this.ensureStarted();
      if (!middleware) {
        middleware = this.getMiddleware(
          // By default, serverless integrations serve on root rather than
          // /graphql, since serverless handlers tend to just do one thing and
          // paths are generally configured as part of deploying the app.
          {
            path: "/",
            bodyParserConfig: false,
            ...options?.expressGetMiddlewareOptions,
          }
        );
      }

      // The middleware will look for req.body, even for GET requests
      if (!req.body) {
        req.body = {};
      }

      return await runMiddleware(req, res, middleware);
    };
  }
}
