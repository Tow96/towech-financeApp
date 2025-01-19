CREATE SCHEMA "users";
--> statement-breakpoint
CREATE TABLE "users"."email_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hashed_code" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users"."password_reset" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hashed_code" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users"."info" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "info_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users"."email_verification" ADD CONSTRAINT "email_verification_user_id_info_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"."info"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users"."password_reset" ADD CONSTRAINT "password_reset_user_id_info_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"."info"("id") ON DELETE cascade ON UPDATE no action;