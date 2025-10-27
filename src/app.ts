import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "../../config/cors";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import verifyAccessToken from "./middleware/verifyAccessToken";

const app = express();

app.use(cors(corsConfig as any));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Auth
app.use("/login", authRoutes);

// Protected user routes
app.use("/users", verifyAccessToken, usersRoutes);

// Basic error handler (mirrors original project's behavior)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  if (err && err.message === "File type not allowed") {
    return res.status(400).json({ error: "File type not allowed" });
  }
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
