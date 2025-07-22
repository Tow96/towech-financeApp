ALTER TABLE "main"."movementSummary" RENAME TO "movement_summary";--> statement-breakpoint
ALTER TABLE "main"."movement_summary" DROP CONSTRAINT "movementSummary_movement_id_movements_id_fk";
--> statement-breakpoint
ALTER TABLE "main"."movement_summary" ADD CONSTRAINT "movement_summary_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "main"."movements"("id") ON DELETE no action ON UPDATE no action;