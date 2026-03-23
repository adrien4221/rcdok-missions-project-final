import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { services } from "./services";

// lifecycles a request can go through
export const requestStatusEnum = pgEnum('request_status', [
  'pending',      // Brand new request
  'in_progress',  // Admin is actively helping them
  'resolved',     // Help was successfully provided
  'declined'      // Unable to help / duplicate
]);

// 2. Define where the request came from 
export const requestSourceEnum = pgEnum('request_source', [
  'public_web',   // Came from the public /directory form
  'admin_walk_in' // Admin manually entered it on the dashboard
]);

export const assistanceRequests = pgTable('assistance_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
    
  status: requestStatusEnum('status').default('pending').notNull(),
  source: requestSourceEnum('source').default('public_web').notNull(),

  // The Person
  requesterName: varchar('requester_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }), 
  contactNumber: varchar('contact_number', { length: 50 }),
  message: text('message'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});