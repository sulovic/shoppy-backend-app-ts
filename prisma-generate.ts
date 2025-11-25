import "dotenv/config";
import { execSync } from "child_process";

const databases = ["users", "nabavke", "odsustva", "reklamacije", "otpad"];

databases.forEach((db) => {
  console.log(`Generating Prisma client for ${db}...`);
  execSync(`npx prisma generate --config ./src/prisma/${db}/prisma.config.ts`, {
    stdio: "inherit",
  });
});
