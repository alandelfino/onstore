ALTER TABLE "video_carousels" ADD COLUMN "layout" text DEFAULT '3d-card' NOT NULL;--> statement-breakpoint
ALTER TABLE "video_carousels" ADD COLUMN "preview_time" integer DEFAULT 3 NOT NULL;