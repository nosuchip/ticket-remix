import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  providerId: text("sub").notNull(),
  email: text("email"),
  name: text("name"),
  picture: text("picture"),
  roles: text("roles")
    .array()
    .default(sql`array[]::varchar[]`),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  // tickets relation is defined in ./relations.ts
});
