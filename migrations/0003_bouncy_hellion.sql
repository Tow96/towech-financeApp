CREATE TABLE "main"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"google_id" varchar NOT NULL,
	"avatar_url" varchar NOT NULL
);
