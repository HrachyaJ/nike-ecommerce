import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

// Create db instance with schema
export const db = drizzle(sql, { schema });

// Add type-safe queries
import { orders, productImages } from "./schema";
export const queries = {
  orders: {
    findFirst: async (options: any) => db.query.orders.findFirst(options),
    // Add more type-safe queries as needed
  },
  productImages: {
    findFirst: async (options: any) =>
      db.query.productImages.findFirst(options),
    // Add more type-safe queries as needed
  },
};
