import { serial, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const requests = pgTable("Requests", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    contact: text("contact").notNull(),
    ministry: text("ministry").notNull(),
    parish: text("parish").notNull(),
    date_requested: timestamp("date_received").defaultNow().notNull(),
    status: text("status").default("Pending").notNull(),

});

export type Requests = typeof requests.$inferSelect;