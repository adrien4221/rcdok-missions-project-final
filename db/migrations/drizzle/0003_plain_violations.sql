CREATE TYPE "public"."request_source" AS ENUM('public_web', 'admin_walk_in');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'in_progress', 'resolved', 'declined');--> statement-breakpoint
CREATE TABLE "assistance_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"status" "request_status" DEFAULT 'pending' NOT NULL,
	"source" "request_source" DEFAULT 'public_web' NOT NULL,
	"requester_name" varchar(255) NOT NULL,
	"email" varchar(255),
	"contact_number" varchar(50),
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "Requests" CASCADE;--> statement-breakpoint
ALTER TABLE "assistance_requests" ADD CONSTRAINT "assistance_requests_organization_id_Organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assistance_requests" ADD CONSTRAINT "assistance_requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;