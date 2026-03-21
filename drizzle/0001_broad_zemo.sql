ALTER TABLE "stores" ALTER COLUMN "plan" SET DEFAULT 'pro';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "trial_ends_at" timestamp;