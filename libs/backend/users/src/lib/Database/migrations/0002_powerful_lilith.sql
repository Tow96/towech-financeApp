ALTER TABLE "email_verification" RENAME COLUMN "verification_token" TO "hashed_code";--> statement-breakpoint
ALTER TABLE "email_verification" RENAME COLUMN "token_created_at" TO "created_at";