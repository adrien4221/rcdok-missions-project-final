import { pgTable, uuid, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { services } from "./services";

export const ministryActivities = pgTable('ministry_activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // The Routing: Who did this, and for what ministry?
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
    
  // metadata
  activityDate: date('activity_date').notNull(),
  
  //try jsonb to hold varying data on different mission services
  details: jsonb('details').notNull(),

  // for analytics and sorting
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});