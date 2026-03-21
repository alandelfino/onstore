CREATE TABLE IF NOT EXISTS "carousel_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"carousel_id" integer NOT NULL,
	"video_id" integer NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"source_type" text NOT NULL,
	"source_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"processed_items" integer DEFAULT 0 NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_syncs" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"url" text NOT NULL,
	"frequency_days" integer NOT NULL,
	"sync_time" text NOT NULL,
	"next_sync_at" timestamp NOT NULL,
	"last_sync_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_filename_unique" UNIQUE("filename")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"external_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" text,
	"image_link" text,
	"link" text,
	"brand" text,
	"availability" text,
	"condition" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_store_external_idx" UNIQUE("store_id","external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shoppable_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"media_url" text NOT NULL,
	"thumbnail_url" text,
	"auto_thumbnails" jsonb,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" integer NOT NULL,
	"allowed_domain" text,
	"plan" text DEFAULT 'free' NOT NULL,
	"current_cycle_views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"verification_code" text,
	"verification_code_expires_at" timestamp,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video_carousels" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"name" text NOT NULL,
	"title" text,
	"subtitle" text,
	"title_color" text DEFAULT '#000000' NOT NULL,
	"subtitle_color" text DEFAULT '#666666' NOT NULL,
	"layout" text DEFAULT '3d-card' NOT NULL,
	"show_products" boolean DEFAULT true NOT NULL,
	"preview_time" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"start_time" integer NOT NULL,
	"end_time" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "view_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"carousel_id" integer NOT NULL,
	"date" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "view_events_store_carousel_date_idx" UNIQUE("store_id","carousel_id","date")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carousel_videos" ADD CONSTRAINT "carousel_videos_carousel_id_video_carousels_id_fk" FOREIGN KEY ("carousel_id") REFERENCES "public"."video_carousels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carousel_videos" ADD CONSTRAINT "carousel_videos_video_id_shoppable_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."shoppable_videos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_imports" ADD CONSTRAINT "catalog_imports_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_syncs" ADD CONSTRAINT "catalog_syncs_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shoppable_videos" ADD CONSTRAINT "shoppable_videos_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video_carousels" ADD CONSTRAINT "video_carousels_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video_products" ADD CONSTRAINT "video_products_video_id_shoppable_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."shoppable_videos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video_products" ADD CONSTRAINT "video_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "view_events" ADD CONSTRAINT "view_events_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "view_events" ADD CONSTRAINT "view_events_carousel_id_video_carousels_id_fk" FOREIGN KEY ("carousel_id") REFERENCES "public"."video_carousels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
