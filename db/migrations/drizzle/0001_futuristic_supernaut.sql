CREATE TYPE "public"."org_type" AS ENUM('diocese', 'vicariate', 'parish', 'quasi-parish', 'station');--> statement-breakpoint
CREATE TABLE "Organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"contact_number" text,
	"type" "org_type" NOT NULL,
	"parent_id" uuid
);
--> statement-breakpoint
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_parent_id_Organizations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."Organizations"("id") ON DELETE cascade ON UPDATE no action;