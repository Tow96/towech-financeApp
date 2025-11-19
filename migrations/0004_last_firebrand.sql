CREATE TABLE "main"."sessions" (
	"id" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"secret_hash" varchar NOT NULL,
	"last_verified_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
