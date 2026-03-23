import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Force Drizzle to read your environment variables
// (If your file is just named '.env', change this to path: '.env')
dotenv.config({ path: '.env.local' }); 

export default defineConfig({
  // 1. Where your typescript schemas live
  schema: './db/schemas/*', 
  
  // 2. Where Drizzle should output the generated SQL files
  out: './db/migrations/drizzle', 
  
  // 3. The database type
  dialect: 'postgresql', 
  
  // 4. Your secure connection string
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!, 
  },
});