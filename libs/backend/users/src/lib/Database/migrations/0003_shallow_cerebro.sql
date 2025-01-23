DELETE FROM "users"."email_verification";
ALTER TABLE "users"."email_verification" DROP CONSTRAINT "email_verification_user_id_info_id_fk";
--> statement-breakpoint
ALTER TABLE "users"."email_verification" ADD CONSTRAINT "email_verification_id_info_id_fk" FOREIGN KEY ("id") REFERENCES "users"."info"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."email_verification" DROP COLUMN "user_id";