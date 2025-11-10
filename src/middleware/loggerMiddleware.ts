import type { Request, Response, NextFunction } from "express";
import winston from "winston";

// Create logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: "error.log", level: "error" }), new winston.transports.File({ filename: "application.log", level: "info" })],
});

// Optional: also log to console in dev
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Request logger middleware
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { password, ...safeBody } = req.body || {};
  logger.info({
    message: "Request logged",
    method: req.method,
    path: req.path,
    query: req.query,
    body: safeBody,
    timestamp: new Date().toISOString(),
  });
  next();
}

// Error logger middleware
function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error({
    message: err.message,
    error: err.stack,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
  next(err);
}

export { requestLogger, errorLogger, logger };
