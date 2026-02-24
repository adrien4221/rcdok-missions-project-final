import { serial, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const donors = pgTable("Donors", {
    id: serial("id").primaryKey(),
    donor_name: text("name").notNull(),
    contact: text("contact").notNull(),
    donation_type: text("donation_type").notNull(),    
    amount: text("amount").notNull(),
    ministry: text("ministry").notNull(),
    date_received: timestamp("date_received").defaultNow().notNull(),
    status: text("status").default("Pending").notNull(),

});

export type Donors = typeof donors.$inferSelect;