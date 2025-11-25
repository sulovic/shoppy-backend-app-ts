import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./odsustva.prisma",
  datasource: {
    url: env("DATABASE_ODSUSTVA_URL"),
  },
});
