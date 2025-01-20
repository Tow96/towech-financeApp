CREATE TABLE "users"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"permanent_session" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users"."sessions" ADD CONSTRAINT "sessions_user_id_info_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"."info"("id") ON DELETE cascade ON UPDATE no action;