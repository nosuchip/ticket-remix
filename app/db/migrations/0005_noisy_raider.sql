CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub" text,
	"email" text NOT NULL,
	"roles" text[] DEFAULT array[]::varchar[],
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
