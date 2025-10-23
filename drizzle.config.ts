import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Explicitly tell dotenv to load the .env.local file
dotenv.config({ path: ".env.local" });

export default defineConfig({
  // Update path to account for the nested src folder
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});