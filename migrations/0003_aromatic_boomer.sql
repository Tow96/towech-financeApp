CREATE TABLE "main"."movementSummary" (
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
	"category_id" uuid NOT NULL,
	"sub_category_id" uuid,
	"description" varchar NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "main"."movementSummary" ADD CONSTRAINT "movementSummary_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "main"."movements"("id") ON DELETE no action ON UPDATE no action;