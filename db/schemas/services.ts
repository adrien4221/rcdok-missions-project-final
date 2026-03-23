import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { organizations } from "./organizations"; // Ensure this path matches your organizations file!

// Master List of Services
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(), // e.g., "Food Pantry"
  category: varchar('category', { length: 255 }), // e.g., "Nutrition", "Legal Aid"
  icon: varchar('icon', { length: 255 }), // e.g., "Coffee", "Shield" 
});

// Junction Table to link Organizations and Services with parish-specific details
export const organizationServices = pgTable('organization_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
    
  // The parish-specific details about this service
  description: text('description'), 
  schedule: varchar('schedule', { length: 255 }), 
});