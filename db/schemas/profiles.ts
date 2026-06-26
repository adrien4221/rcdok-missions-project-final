import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  full_name: text("full_name"),
  service_id: uuid("service_id"),
  role: text("role").default("staff"),
  is_approved: boolean("is_approved").default(false).notNull(),

  created_at: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});