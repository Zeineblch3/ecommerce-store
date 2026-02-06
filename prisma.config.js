import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    adapter: "postgresql", // ou autre driver
    url: process.env.DATABASE_URL,
  },
});
