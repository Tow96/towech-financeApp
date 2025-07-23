CREATE TABLE "main"."budget_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"budget_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"category_id" uuid NOT NULL,
	"sub_category_id" uuid,
	"limit" integer
);
--> statement-breakpoint
CREATE TABLE "main"."budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"year" integer NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "main"."budget_summary" ADD CONSTRAINT "budget_summary_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "main"."budgets"("id") ON DELETE no action ON UPDATE no action;