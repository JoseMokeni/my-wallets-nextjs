// Load dotenv only in development (not needed in Docker where env vars are set)
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
