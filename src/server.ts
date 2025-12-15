import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "./config/cors.js";
import { envSchema } from "./schemas/schemas.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { errorLogger } from "./middleware/loggerMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";
import verifyAccessToken from "./middleware/verifyAccessToken.js";
import checkUserRole from "./middleware/checkUserRole.js";

// Routers
import loginRouter from "./routes/auth/login.js";
import logoutRouter from "./routes/auth/logout.js";
import refreshRouter from "./routes/auth/refresh.js";
import googleLoginRouter from "./routes/auth/googleLogin.js";
import githubLoginRouter from "./routes/auth/githubLogin.js";
import facebookLoginRouter from "./routes/auth/facebookLogin.js";

import userRouter from "./routes/users.js";
import reklamacijeRouter from "./routes/reklamacije.js";
import reklamacijePublicRouter from "./routes/reklamacijePublic.js";
import uploadsRouter from "./routes/uploads.js";
import otpadRouter from "./routes/otpad.js";
import nabavkeRouter from "./routes/nabavke.js";

envSchema.parse(process.env);

const app = express();

const port = process.env.PORT || 5777;

// Nginx reverse proxy
app.set("trust proxy", 1);

app.use(cors(corsConfig as any));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("query parser", "extended");
app.use(cookieParser());

// Global rate limiter
app.use(rateLimiter(1, 100));

// Loggers
//app.use(requestLogger);
app.use(errorLogger);

// Auth routes
app.use("/auth/login", rateLimiter(3, 10), loginRouter);
app.use("/auth/logout", logoutRouter);
app.use("/auth/refresh", rateLimiter(1, 10), refreshRouter);
app.use("/auth/google", rateLimiter(3, 10), googleLoginRouter);
app.use("/auth/github", rateLimiter(3, 10), githubLoginRouter);
app.use("/auth/facebook", rateLimiter(3, 10), facebookLoginRouter);

// User routes
app.use("/users", verifyAccessToken, checkUserRole, userRouter);

// Reklamacije routes
app.use("/reklamacije", verifyAccessToken, checkUserRole, reklamacijeRouter);
app.use("/public/reklamacije", reklamacijePublicRouter);

//Otpad routes
app.use("/otpad", verifyAccessToken, checkUserRole, otpadRouter);

//Nabavke routes
app.use("/nabavke", verifyAccessToken, checkUserRole, nabavkeRouter);

// Uploads routes
app.use("/uploads", verifyAccessToken, checkUserRole, uploadsRouter);

/*

// Odsustva  routes

app.use("/odsustva/evidencija", verifyAccessToken, require("./routes/odsustva/evidencija"));
app.use("/odsustva/dodeljena", verifyAccessToken, require("./routes/odsustva/dodeljena"));

*/

app.use(errorHandler);

app.listen(Number(port), () => {
  console.log(`TS server running at http://localhost:${port}/`);
});
