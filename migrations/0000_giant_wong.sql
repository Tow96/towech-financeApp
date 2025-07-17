CREATE SCHEMA "main";
--> statement-breakpoint
CREATE TABLE "main"."categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"icon_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "main"."sub-categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"icon_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "main"."sub-categories" ADD CONSTRAINT "sub-categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "main"."categories"("id") ON DELETE no action ON UPDATE no action;