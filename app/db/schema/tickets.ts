import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { events } from "./events";
import { sql } from "drizzle-orm";

export const tickets = pgTable("tickets", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  issuedAt: timestamp("issued_at").notNull(),
  usedAt: timestamp("used_at"),
  price: numeric("price"),
  currency: text("currency"),
  receipts: text("receipts")
    .array()
    .default(sql`array[]::varchar[]`),
  email: text("email"),
  description: text("description"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});
