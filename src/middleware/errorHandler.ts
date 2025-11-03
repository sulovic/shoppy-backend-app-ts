import type { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (
    err: Error | any,
    req: Request,
    res: Response,
    next: NextFunction // eslint-disable-line
): void => {

    // Handle JSON parse errors
    if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
        res.status(400).json({ error: "Invalid JSON format" });
        return
    }

    //Handle CORS errors
    if (err.message === "Not allowed by CORS") {
        res.status(403).json({ error: "CORS policy violation: Origin not allowed" });
        return
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        res.status(400).json({
            error: "Validation error",
            details: err.message,
        });
        return
    }

    if (err.name === "Invalid Google token payload") {
        res.status(401).json({ error: "Unauthorized - Invalid Google token payload" });
        return;
    }

    if (err.name === "Google auth Error") {
        res.status(401).json({ error: "Unauthorized - Google auth Error" });
        return;
    }



    // Handling Prisma errors  
    if (err?.name?.includes("PrismaClientKnownRequestError")) {
        if (err.code === "P2002") {
            res.status(409).json({ message: "Duplicate entry detected." });
            return;
        }
        if (err.code === "P2003") {
            res.status(400).json({ message: "Invalid foreign key reference." });
            return;
        }
        if (err.code === "P2009") {
            res.status(400).json({ message: "Data validation error. Please check your input data." });
            return;
        }
        if (err.code === "P2025") {
            res.status(404).json({ message: "Record not found." });
            return;
        }
    } else if (err?.name?.includes("PrismaClientInitializationError")) {
        if (err.errorCode === "P1000") {
            res.status(503).json({ message: "Database is unavailable. Please check your database connection." });
            return;
        }
        if (err.errorCode === "P1001") {
            res.status(503).json({ message: "Database connection timed out. Please try again later." });
            return;
        }
        if (err.errorCode === "P1002") {
            res.status(503).json({ message: "Database connection was forcibly closed. Please check your server setup." });
            return;
        }
        res.status(500).json({ message: "Prisma Client Initialization Error." });
        return;
    } else if (err?.name?.includes("PrismaClientUnknownRequestError")) {
        res.status(400).json({ message: "Invalid request." });
        return;
    } else if (err?.name?.includes("PrismaClientValidationError")) {
        res.status(400).json({ message: "Data validation error. Please check your input data." });
        return;
    } else if (err?.name?.includes("PrismaClientRustPanicError")) {
        res.status(500).json({ message: "Prisma Client Rust Panic." });
        return;
    }

    res.status(500).json({
        message: err.message || "Internal Server Error",
    });
    
};

export default errorHandler;