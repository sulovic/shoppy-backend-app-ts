import "dotenv/config";
import { execSync } from "child_process";
import { rmSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databases = ["users", "nabavke", "odsustva", "reklamacije", "otpad"];

// Clean Prisma client directories
console.log("Cleaning old Prisma client directories...");
databases.forEach((db) => {
  const dir = path.resolve(__dirname, `prisma_clients/${db}/client`);
  if (existsSync(dir)) {
    try {
      rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Deleted: ${dir}`);
    } catch (err) {
      console.error(`❌ Failed to delete ${dir}:`, err);
    }
  } else {
    console.log(`⚠️  Directory does not exist: ${dir}`);
  }
});

// Generate Prisma clients
console.log("\nGenerating Prisma clients...");
databases.forEach((db) => {
  const configPath = path.resolve(__dirname, `./src/prisma/${db}/prisma.config.ts`);
  console.log(`\n🔹 Generating client for: ${db}`);
  try {
    execSync(`npx prisma generate --config ${configPath}`, { stdio: "inherit" });
    console.log(`✅ Successfully generated client for ${db}`);
  } catch (err) {
    console.error(`❌ Failed to generate client for ${db}:`, err);
  }
});
