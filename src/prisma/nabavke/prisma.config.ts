import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./nabavke.prisma",
  datasource: {
    url: env("DATABASE_NABAVKE_URL"),
  },
});
