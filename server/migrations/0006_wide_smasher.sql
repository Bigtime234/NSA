CREATE TYPE "public"."sport_category" AS ENUM('all', 'football', 'tennis', 'basketball', 'boxing', 'badminton', 'handball');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category" "sport_category" DEFAULT 'all' NOT NULL;--> statement-breakpoint
CREATE INDEX "orderProduct_productIdx" ON "orderProduct" USING btree ("productID");--> statement-breakpoint
CREATE INDEX "orderProduct_orderIdx" ON "orderProduct" USING btree ("orderID");