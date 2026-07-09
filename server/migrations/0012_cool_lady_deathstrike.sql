CREATE TYPE "public"."item_type" AS ENUM('apparel', 'equipment');--> statement-breakpoint
ALTER TABLE "orderProduct" ALTER COLUMN "productVariantID" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orderProduct" ALTER COLUMN "productID" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orderProduct" ALTER COLUMN "orderID" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "size" text;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "playerName" text;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "playerNumber" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "itemType" "item_type" DEFAULT 'apparel' NOT NULL;