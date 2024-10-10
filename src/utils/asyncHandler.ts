import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // fn is a function that is passed as a parameter
      // fn is an async function that takes req, res, next as parameters
      await fn(req, res, next);
    } catch (error: unknown) {
      // error is of type unknown
      // error is casted to an object with code and message properties
      // statusCode is assigned the value of code if code is between 100 and 600
      const err = error as { code?: number; message?: string };
      const statusCode = (err.code && err.code >= 100 && err.code < 600) ? err.code : 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  }; // higher order function
  // that can receive a function and return a new function
  // funct received as a parameter is passes into another async function
  
  /*
  const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }; // higher order function
  */
  // another way of writing the same function
  
  export { asyncHandler };
  