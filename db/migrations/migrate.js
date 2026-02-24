const { migrate } = require("drizzle-orm/postgres-js/migrator");
const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres")
require("dotenv").config({ path: ".env.local"});

const pushMigration = async () =>{
    const migrationClient = postgres(process.env.DB_CONNECTION_STRING, {
        max: 1,
    });
    const migrationDb = drizzle(migrationClient);

    await migrate(migrationDb, {
        migrationsFolder: "./db/migrations/drizzle",
    });
    await migrationClient.end();
};

pushMigration();