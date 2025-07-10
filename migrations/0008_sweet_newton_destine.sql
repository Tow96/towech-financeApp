ALTER SCHEMA "budgeting" RENAME TO "common";
--> statement-breakpoint
ALTER TABLE "common"."sub-categories" DROP CONSTRAINT "sub-categories_parent_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "common"."sub-categories" ADD CONSTRAINT "sub-categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "common"."categories"("id") ON DELETE no action ON UPDATE no action;