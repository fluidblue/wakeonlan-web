import { NextFunction, Request, Response } from "express";

// Wrapper function for using async functions with express.
//
// From the docs: "The wrap() function is a wrapper that catches
// rejected promises and calls next() with the error as the first argument."
// Source: http://expressjs.com/en/advanced/best-practice-performance.html#use-promises
//
// It is needed (in express v4) until express v5 is released.
// From the docs: "Starting with Express 5, route handlers and middleware that return
// a Promise will call next(value) automatically when they reject or throw an error."
// Source: http://expressjs.com/en/guide/error-handling.html#catching-errors
//
// This function is a modified version of the one presented in the docs. It uses TypeScript types.
const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next);
    }
};

export default wrap;
