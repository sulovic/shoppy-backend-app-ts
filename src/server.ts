import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConfig from "./config/cors.ts";
import { envSchema } from "./schemas/schemas.ts";
import rateLimiter from "./middleware/rateLimiter.ts";
//import { requestLogger, errorLogger } from "./middleware/loggerMiddleware.ts";
import errorHandler from "./middleware/errorHandler.ts";
import verifyAccessToken from "./middleware/verifyAccessToken.ts";
import checkUserRole from "./middleware/checkUserRole.ts";

// Routers
import loginRouter from "./routes/auth/login.ts";
import logoutRouter from "./routes/auth/logout.ts";
import refreshRouter from "./routes/auth/refresh.ts";
import googleLoginRouter from "./routes/auth/googleLogin.ts";
import githubLoginRouter from "./routes/auth/githubLogin.ts";
import facebookLoginRouter from "./routes/auth/facebookLogin.ts";

import userRouter from "./routes/users.ts";
import reklamacijeRouter from "./routes/reklamacije.ts";
import reklamacijePublicRouter from "./routes/reklamacijePublic.ts";
import uploadsRouter from "./routes/uploads.ts";
import otpadRouter from "./routes/otpad.ts";
import nabavkeRouter from "./routes/nabavke.ts";

envSchema.parse(process.env);

const app = express();

const port = process.env.PORT || 3010;

app.use(cors(corsConfig as any));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("query parser", "extended");
app.use(cookieParser());
app.use(rateLimiter(1, 100));

//app.use(requestLogger);
//app.use(errorLogger);

// Auth routes
app.use("/auth/login", rateLimiter(3, 10), loginRouter);
app.use("/auth/logout", logoutRouter);
app.use("/auth/refresh", refreshRouter);
app.use("/auth/google", googleLoginRouter);
app.use("/auth/github", githubLoginRouter);
app.use("/auth/facebook", facebookLoginRouter);

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

// Evidencija Tokova otpada routes

app.use("/otpad/vrste-otpada", verifyAccessToken, require("./routes/otpad/vrste"));
app.use("/otpad/proizvodi", verifyAccessToken, require("./routes/otpad/proizvodi"));
app.use("/otpad/evidencija", verifyAccessToken, require("./routes/otpad/evidencija"));
app.use("/otpad/delovodnik", verifyAccessToken, require("./routes/otpad/delovodnik"));


*/

app.use(errorHandler);

app.listen(Number(port), () => {
  console.log(`TS server running at http://localhost:${port}/`);
});
