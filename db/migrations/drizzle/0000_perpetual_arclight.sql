CREATE TABLE "Donors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"donation_type" text NOT NULL,
	"amount" text NOT NULL,
	"ministry" text NOT NULL,
	"date_received" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"ministry" text NOT NULL,
	"parish" text NOT NULL,
	"date_received" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL
);
