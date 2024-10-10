import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      res.status(err.code || 500).json({
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
  