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
    await mysqlPool.query(`DROP TABLE IF EXISTS users;`);
    await mysqlPool.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50),
        password VARCHAR(50),
        is_admin TINYINT(1) DEFAULT 0,
        email VARCHAR(100)
      );
    `);

    // Insere usuários de teste
    await mysqlPool.query(`
      INSERT INTO users (username, password, is_admin, email) VALUES
      ('admin', 'supersecretpassword123!', 1, 'admin@example.com'),
      ('john', 'password123', 0, 'john@example.com'),
      ('alice', 'alicepass', 0, 'alice@example.com'),
      ('bob', 'bobsecure', 0, 'bob@example.com');
    `);

    console.log('Banco de dados MySQL configurado com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar o banco MySQL:', error);
  } finally {
    await mysqlPool.end();
  }
}

setupMySQLDatabase();
