import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./reklamacije.prisma",
  datasource: {
    url: env("DATABASE_REKLAMACIJE_URL"),
  },
});
