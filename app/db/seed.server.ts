/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";

import { Event, Ticket } from "./types";

import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import { getOrThrow } from "~/utils/env";
import path from "path";
import postgres from "postgres";
import schema from "./schema";

const client = postgres(getOrThrow("DATABASE_URL"), { max: 1 });
const db = drizzle(client, { schema });

type Adapter<T = any> = (value: any) => T;

const adaptType = <T>(
  item: Record<string, any>,
  adapters: Record<string, Adapter>,
) => {
  const keys = Object.keys(item);
  const result = {} as Record<string, any>;

  for (const key of keys) {
    const value = item[key];
    const adapter = adapters[key];

    result[key] = adapter ? adapter(value) : value;
  }

  return result as T;
};

const main = async () => {
  const seedPath = (filename: string) => path.resolve("app/db/seed/", filename);

  let content: any[] = [];

  console.log("Seeding events...");

  content = JSON.parse(
    fs.readFileSync(seedPath("events.json"), "utf8"),
  ) as any[];

  const events = content.map((item) =>
    adaptType<Event>(item, {
      date: (value) => new Date(value),
      createdAt: (value) => (value ? new Date(value) : new Date()),
    }),
  );

  await db.insert(schema.events).values(events);

  console.log("Seeding tickets...");

  content = JSON.parse(
    fs.readFileSync(seedPath("tickets.json"), "utf8"),
  ) as any[];

  const tickets = content.map((item) =>
    adaptType<Ticket>(item, {
      issuedAt: (value) => new Date(value),
      usedAt: (value) => (value ? new Date(value) : value),
      createdAt: (value) => (value ? new Date(value) : new Date()),
    }),
  );

  await db.insert(schema.tickets).values(tickets);

  console.log("Seed done");

  process.exit(0);
};

main();
