import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/users-client";

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export const handleError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma specific errors
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          error: "Unique constraint violation",
          field: err.meta?.target,
        });
      case "P2025":
        return res.status(404).json({
          error: "Record not found",
        });
      default:
        return res.status(500).json({
          error: "Database error",
        });
    }
  }

  return res.status(500).json({
    error: "Internal Server Error",
  });
};
