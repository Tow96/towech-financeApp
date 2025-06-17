CREATE SCHEMA "budgeting";
--> statement-breakpoint
CREATE TABLE "budgeting"."categories" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"parent_id" uuid,
	"iconId" integer NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "categories_id_unique" UNIQUE("id")
);
