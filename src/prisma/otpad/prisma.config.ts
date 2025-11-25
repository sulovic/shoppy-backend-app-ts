import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./otpad.prisma",
  datasource: {
    url: env("DATABASE_OTPAD_URL"),
  },
});
