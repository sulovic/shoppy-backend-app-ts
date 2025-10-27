import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const port = process.env.PORT || 3010;

const server = app.listen(Number(port), () => {
  console.log(`TS server running at http://localhost:${port}/`);
});

export default server;
