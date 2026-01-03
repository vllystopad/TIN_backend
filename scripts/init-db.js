const { DataSource } = require('typeorm');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './dev.db';
const distPath = path.join(__dirname, '..', 'dist');

async function initDatabase() {
    console.log('Initializing database...');
    console.log('Database path:', dbPath);

    if (!fs.existsSync(distPath)) {
        console.error('Error: dist folder not found. Please run "npm run build" first.');
        process.exit(1);
    }

    const dataSource = new DataSource({
        type: 'sqlite',
        database: dbPath,
        entities: [distPath + '/**/*.entity.js'],
        migrations: [distPath + '/database/migrations/*.js'],
        synchronize: false,
        logging: true,
    });

    try {
        await dataSource.initialize();
        console.log('Data Source initialized successfully');

        const pendingMigrations = await dataSource.showMigrations();

        if (pendingMigrations) {
            console.log('Running migrations...');
            await dataSource.runMigrations();
            console.log('Migrations completed successfully');
        } else {
            console.log('No pending migrations');
        }

        await dataSource.destroy();
        console.log('Database initialization complete!');
        console.log('Database file created at:', path.resolve(dbPath));
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
}

initDatabase();

