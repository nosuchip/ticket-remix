import {
  boolean,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const events = pgTable("events", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  location: numeric("location").array(2),
  images: text("images")
    .array()
    .default(sql`array[]::varchar[]`),
  prices: jsonb("prices").default(sql`'[]'::jsonb`),
  description: text("description"),
  closed: boolean("closed").default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});
