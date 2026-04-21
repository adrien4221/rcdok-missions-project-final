import { pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";


export const orgTypeEnum = pgEnum('org_type', [
  'diocese', 
  'vicariate', 
  'parish', 
  'quasi-parish',
  'station',
  'chapel'
]);


export const organizations = pgTable("Organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  contactNumber: text("contact_number"),
  
  type: orgTypeEnum("type").notNull(),
  
  parentId: uuid("parent_id").references((): any => organizations.id, { 
    onDelete: 'cascade' // if a vicariate is deleted, delete its parishes too
  }),
});