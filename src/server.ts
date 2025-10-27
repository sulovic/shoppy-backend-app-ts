import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "./config/cors";
import rateLimiter from "./middleware/rateLimiter";
import verifyAccessToken from "./utils/verifyAccessToken";

dotenv.config();
const app = express();

app.use(cors(corsConfig as any));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Auth routes

app.use("/login", rateLimiter(3, 10), require("./routes/auth/login"));
app.use("/refresh", require("./routes/auth/refresh"));
app.use("/logout", require("./routes/auth/logout"));

// User routes

app.use("/users", verifyAccessToken, require("./routes/users"));

// Odsustva otpada routes

app.use("/odsustva/evidencija", verifyAccessToken, require("./routes/odsustva/evidencija"));
app.use("/odsustva/dodeljena", verifyAccessToken, require("./routes/odsustva/dodeljena"));

// Nabavke otpada routes

app.use("/nabavke/porudzbine", verifyAccessToken, require("./routes/nabavke/porudzbine"));
app.use("/nabavke/proizvodi", verifyAccessToken, require("./routes/nabavke/proizvodi"));
app.use("/nabavke/sadrzaj", verifyAccessToken, require("./routes/nabavke/sadrzaj"));

// Evidencija Tokova otpada routes

app.use("/otpad/vrste-otpada", verifyAccessToken, require("./routes/otpad/vrste"));
app.use("/otpad/proizvodi", verifyAccessToken, require("./routes/otpad/proizvodi"));
app.use("/otpad/evidencija", verifyAccessToken, require("./routes/otpad/evidencija"));
app.use("/otpad/delovodnik", verifyAccessToken, require("./routes/otpad/delovodnik"));

// Reklamacije routes
app.use("/reklamacije", verifyAccessToken, require("./routes/reklamacije/reklamacije"));

// Uploads routes

app.use("/uploads", verifyAccessToken, require("./routes/uploads"));

// Public routes
app.use("/public/reklamacije", require("./routes/reklamacije/reklamacijePublic"));

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

const port = process.env.PORT || 3010;

const server = app.listen(Number(port), () => {
  console.log(`TS server running at http://localhost:${port}/`);
});
