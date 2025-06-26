CREATE SCHEMA "distribution";
--> statement-breakpoint
CREATE TABLE "distribution"."wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"user_id" varchar NOT NULL,
	"icon_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"deleted_at" timestamp with time zone
);
