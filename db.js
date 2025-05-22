const mysql = require("mysql2/promise")

// Crea un pool di connessioni a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // es: 'localhost' o 'mysql' (in Docker)
  user: process.env.DB_USER,       // es: 'loginuser'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,   // es: 'logindb'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function waitForDatabase() {
  let connected = false
  while (!connected) {
    try {
      await pool.query('SELECT 1')
      connected = true
      console.log("Connessione al database riuscita.")
    } catch (err) {
      console.log("Database non ancora pronto, nuovo tentativo di connessione tra 2s...")
      await new Promise(res => setTimeout(res, 2000))
    }
  }
}

async function createUsersTableIfNotExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT FALSE,
      last_email_sent TIMESTAMP NULL
    )
  `;
  await pool.query(createTableQuery);
  console.log("table created")
}


module.exports = {
  pool, 
  waitForDatabase,
  createUsersTableIfNotExists
}

