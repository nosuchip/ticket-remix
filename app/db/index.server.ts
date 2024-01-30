import { drizzle } from "drizzle-orm/postgres-js";
import { getOrThrow } from "~/utils/env";
import postgres from "postgres";
import schema from "./schema";

const client = postgres(getOrThrow("DATABASE_URL"), { max: 1 });

export const db = drizzle(client, {
  schema,
});
