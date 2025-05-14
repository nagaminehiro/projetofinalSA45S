require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function setupDatabase() {
  try {
    // Create users table
    await pool.query(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        email VARCHAR(100)
      );
    `);

    // Insert some test users
    await pool.query(`
      INSERT INTO users (username, password, is_admin, email) VALUES
      ('admin', 'supersecretpassword123!', TRUE, 'admin@example.com'),
      ('john', 'password123', FALSE, 'john@example.com'),
      ('alice', 'alicepass', FALSE, 'alice@example.com'),
      ('bob', 'bobsecure', FALSE, 'bob@example.com');
    `);

    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await pool.end();
  }
}

setupDatabase();
