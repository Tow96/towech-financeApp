ALTER TABLE "main"."budget_summary" RENAME COLUMN "sub_category_id" TO "category_sub_id";--> statement-breakpoint
ALTER TABLE "main"."budget_summary" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "main"."budget_summary" ADD COLUMN "category_type" varchar NOT NULL;