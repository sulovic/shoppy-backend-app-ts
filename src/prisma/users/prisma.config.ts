import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./users.prisma",
  datasource: {
    url: env("DATABASE_USERS_URL"),
  },
});
