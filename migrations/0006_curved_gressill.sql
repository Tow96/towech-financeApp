CREATE TABLE "distribution"."movement_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movement_id" uuid NOT NULL,
	"origin_wallet_id" uuid,
	"destination_wallet_id" uuid,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distribution"."movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"user_id" varchar NOT NULL,
	"category_id" varchar NOT NULL,
	"description" varchar NOT NULL,
	"data" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "distribution"."movement_summary" ADD CONSTRAINT "movement_summary_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "distribution"."movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distribution"."movement_summary" ADD CONSTRAINT "movement_summary_origin_wallet_id_wallets_id_fk" FOREIGN KEY ("origin_wallet_id") REFERENCES "distribution"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distribution"."movement_summary" ADD CONSTRAINT "movement_summary_destination_wallet_id_wallets_id_fk" FOREIGN KEY ("destination_wallet_id") REFERENCES "distribution"."wallets"("id") ON DELETE no action ON UPDATE no action;