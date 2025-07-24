CREATE SCHEMA "main";
--> statement-breakpoint
CREATE TABLE "main"."budget_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"budget_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"category_id" uuid NOT NULL,
	"sub_category_id" uuid,
	"limit" integer NOT NULL
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
CREATE TABLE "main"."categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"icon_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "main"."movement_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movement_id" uuid NOT NULL,
	"origin_wallet_id" uuid,
	"destination_wallet_id" uuid,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"category_type" varchar NOT NULL,
	"category_id" uuid,
	"category_sub_id" uuid,
	"description" varchar NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."sub-categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"icon_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
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
ALTER TABLE "main"."budget_summary" ADD CONSTRAINT "budget_summary_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "main"."budgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."movement_summary" ADD CONSTRAINT "movement_summary_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "main"."movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."sub-categories" ADD CONSTRAINT "sub-categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "main"."categories"("id") ON DELETE no action ON UPDATE no action;