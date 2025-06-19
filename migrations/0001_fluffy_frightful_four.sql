CREATE TABLE "budgeting"."sub-categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"iconId" integer NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "budgeting"."categories" DROP CONSTRAINT "categories_id_unique";--> statement-breakpoint
ALTER TABLE "budgeting"."categories" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "budgeting"."categories" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "budgeting"."categories" DROP COLUMN "parent_id";