import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import { getOrThrow } from "~/utils/env";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { parse } from 'pg-connection-string';
import path from "path";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(getOrThrow("DATABASE_MIGRATOR_URL"), { max: 1 });
const db = drizzle(client);

const run = async () => {
  try {
    await migrate(db, { migrationsFolder: "./app/db/migrations" });
    console.log("Migrations complete!");

    const sqlContent = fs.readFileSync(
      path.resolve("app/db/docs/03-grant-app-user-permissions.sql"),
    );

    const { database, user } = parse(getOrThrow("DATABASE_MIGRATOR_URL"));

    const sqlCommands = sqlContent.toString()
      .replace(/{DB_DATABASE}/g, database!)
      .replace(/{DB_APP_USER}/g, user!)

    await db.execute(sql.raw(sqlCommands));

    process.exit(0);
  } catch (error) {
    console.error("Migrations failed!", error);
    process.exit(1);
  }
};

run();
