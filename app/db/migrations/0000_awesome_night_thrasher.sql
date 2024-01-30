CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"date" timestamp NOT NULL,
	"location" numeric[2],
	"images" text[] DEFAULT array[]::varchar[],
	"prices" jsonb DEFAULT '[]'::jsonb,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"issued_at" timestamp NOT NULL,
	"used_at" timestamp,
	"price" numeric,
	"currency" text,
	"receipts" text[] DEFAULT array[]::varchar[]
);
