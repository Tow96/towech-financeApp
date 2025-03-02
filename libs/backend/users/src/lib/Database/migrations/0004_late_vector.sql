DELETE FROM "users"."password_reset";
ALTER TABLE "users"."password_reset" DROP CONSTRAINT "password_reset_user_id_info_id_fk";
--> statement-breakpoint
ALTER TABLE "users"."password_reset" ADD CONSTRAINT "password_reset_id_info_id_fk" FOREIGN KEY ("id") REFERENCES "users"."info"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."password_reset" DROP COLUMN "user_id";