import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import { services } from './db/schemas/services';

// 1. Load the database URL securely
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DB_CONNECTION_STRING!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function seedServices() {
  console.log('🌱 Seeding master services list...');

  const masterServices = [
    { name: 'Busog Puso (Nutrition)', category: 'Nutrition', icon: '🍲' },
    { name: 'Civil Registry', category: 'Administration', icon: '📝' },
    { name: 'Legal Aid (Justice)', category: 'Justice', icon: '⚖️' },
    { name: 'Kaagapay (Mental Health)', category: 'Mental Health', icon: '🧠' },
    { name: 'Medical Assistance', category: 'Medical', icon: '🩺' },
    { name: 'Salubong (Rehab)', category: 'Rehabilitation', icon: '🏥' },
    { name: 'Community (BEC)', category: 'Community', icon: '🤝' },
  ];

  try {
    // Inject into Supabase
    await db.insert(services)
            .values(masterServices)
            .onConflictDoNothing(); 

    console.log('🎉 Master services successfully injected into Supabase!');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  } finally {
    // 4. Hang up the connection
    await client.end();
  }
}

// Execute the function
seedServices();