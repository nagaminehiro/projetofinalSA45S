require('dotenv').config();
const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function setupMySQLDatabase() {
  try {
    // Cria tabela users
    await mysqlPool.query(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        email VARCHAR(100)
      );
    `);

    // Insere usuários de teste
    await mysqlPool.query(`
      INSERT INTO users (username, password, is_admin, email) VALUES
      ('admin', 'supersecretpassword123!', TRUE, 'admin@example.com'),
      ('john', 'password123', FALSE, 'john@example.com'),
      ('alice', 'alicepass', FALSE, 'alice@example.com'),
      ('bob', 'bobsecure', FALSE, 'bob@example.com');
    `);

    console.log('Banco de dados MySQL configurado com sucesso');
  } catch (err) {
    console.error('Erro ao configurar o banco MySQL:', err);
  } finally {
    await mysqlPool.end();
  }
}

setupMySQLDatabase();
