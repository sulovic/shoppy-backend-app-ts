import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "./config/cors.ts";
import { envSchema } from "./schemas/schemas.ts";
import rateLimiter from "./middleware/rateLimiter.ts";
import { requestLogger, errorLogger } from "./middleware/loggerMiddleware.ts";
import errorHandler from "./middleware/errorHandler.ts";
// Routers
import userRouter from "./routes/users.ts";
import loginRouter from "./routes/auth/login.ts";
import logoutRouter from "./routes/auth/logout.ts";

dotenv.config();

envSchema.parse(process.env);

const app = express();

const port = process.env.PORT || 3010;

app.use(cors(corsConfig as any));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(rateLimiter(1, 100));
app.use(requestLogger);
app.use(errorLogger);

app.use("/users", userRouter);
app.use("/auth/login", rateLimiter(3, 10), loginRouter);
app.use("/auth/logout", logoutRouter);

/*
// Auth routes

app.use("/refresh", require("./routes/auth/refresh"));


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

*/

app.use(errorHandler);

app.listen(Number(port), () => {
  console.log(`TS server running at http://localhost:${port}/`);
});
