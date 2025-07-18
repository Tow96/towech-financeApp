CREATE TABLE "main"."wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "main"."sub-categories" ALTER COLUMN "parent_id" SET NOT NULL;