import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/** 包装异步路由，把 Promise 拒绝转交给 Express 错误处理中间件。 */
export function asyncHandler(fn: AsyncRoute): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
