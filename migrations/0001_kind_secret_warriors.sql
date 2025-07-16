ALTER TABLE "main"."categories" RENAME COLUMN "deleted_at" TO "archived_at";--> statement-breakpoint
ALTER TABLE "main"."sub-categories" ADD COLUMN "archived_at" timestamp with time zone;