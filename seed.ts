import { drizzle } from 'drizzle-orm/postgres-js';
import path from 'path';
import postgres from 'postgres';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { organizations } from './db/schemas/organizations';

// 1. Load the .env.local file to get the DB connection string
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// 2. Setup the database connection
const connectionString = process.env.DB_CONNECTION_STRING!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // 3. Read the CSV file directly from the hard drive
  const fileContent = fs.readFileSync('test-parishes.csv', 'utf-8');
  
  // Split the file into lines, ignoring any empty lines at the bottom
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');

  // 4. Transform the CSV lines into clean JavaScript objects
    const rows = lines.slice(1).map(line => {
        // This Regex splits by comma but IGNORES commas inside quotes
        const regex = /,(?=(?:(?:[^"]*"){2})*[^自"]*$)/;
        const parts = line.split(regex).map(part => part.replace(/^"|"$/g, '').trim());
        
        const [name, type, address, contact, parentName] = parts;

        return {
        name: name,
        type: type as any,
        address: address || null,
        contactNumber: contact || null,
        parentName: parentName || null
        };
    });

  // 5. THE HIERARCHY MAP: 
  const idMap = new Map<string, string>();

  try {
    // PHASE A: Insert the Diocese 
    console.log('Building Diocese...');
    const dioceseData = rows.filter(r => r.type === 'diocese');
    for (const org of dioceseData) {
      const [inserted] = await db.insert(organizations).values({
        name: org.name,
        type: org.type,
        address: org.address,
        contactNumber: org.contactNumber,
        parentId: null
      }).returning({ id: organizations.id });

      idMap.set(org.name, inserted.id); 
    }

    // PHASE B: Insert Vicariates (Using the Diocese ID)
    console.log('Building Vicariates...');
    const vicariateData = rows.filter(r => r.type === 'vicariate');
    for (const org of vicariateData) {
      const parentId = idMap.get(org.parentName!);
      const [inserted] = await db.insert(organizations).values({
        name: org.name,
        type: org.type,
        address: org.address,
        contactNumber: org.contactNumber,
        parentId: parentId
      }).returning({ id: organizations.id });

      idMap.set(org.name, inserted.id);
    }

    // PHASE C: Insert Parishes & Quasi-Parishes (Using the Vicariate IDs)
    console.log('Building Parishes...');
    const parishData = rows.filter(r => r.type === 'parish' || r.type === 'quasi-parish');
    for (const org of parishData) {
      const parentId = idMap.get(org.parentName!);
      const [inserted] = await db.insert(organizations).values({
        name: org.name,
        type: org.type,
        address: org.address,
        contactNumber: org.contactNumber,
        parentId: parentId
      }).returning({ id: organizations.id });

      idMap.set(org.name, inserted.id);
    }

    // PHASE D: Insert Mission Stations (Using the Parish IDs)
    console.log('Building Mission Stations...');
    const stationData = rows.filter(r => r.type === 'station');
    for (const org of stationData) {
      const parentId = idMap.get(org.parentName!);
      await db.insert(organizations).values({
        name: org.name,
        type: org.type,
        address: org.address,
        contactNumber: org.contactNumber,
        parentId: parentId
      });
    }

    console.log('🎉 Database seeding complete! Check Supabase!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.end();
  }
}

console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Run 
seedDatabase();