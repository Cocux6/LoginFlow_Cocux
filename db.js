const mysql = require("mysql2/promise")

// Crea un pool di connessioni a MySQL per gestire più richieste in modo efficiente
const pool = mysql.createPool({
  host: process.env.DB_HOST,       //  'mysql' (se usi Docker)
  user: process.env.DB_USER,       //  'loginuser'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,   //  'logindb'
  waitForConnections: true,
  connectionLimit: 10,             // Numero massimo di connessioni contemporanee
  queueLimit: 0                    // Nessun limite alla coda di connessioni in attesa
})

// Aspetta che il database sia pronto (utile all'avvio o in Docker)
async function waitForDatabase() {
  let connected = false

  while (!connected) {
    try {
      await pool.query('SELECT 1') // Query di test
      connected = true
      console.log("Connessione al database riuscita.")
    } catch (err) {
      console.log("Database non ancora pronto, nuovo tentativo di connessione tra 2s...")
      await new Promise(res => setTimeout(res, 2000)) // Attende 2 secondi prima di riprovare
    }
  }
}

// Crea la tabella `users` se non esiste già
async function createUsersTableIfNotExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT FALSE,
      last_email_sent TIMESTAMP NULL
    )
  `

  await pool.query(createTableQuery)
  console.log("Tabella 'users' creata o già esistente")
}

// Esportazione del pool e delle funzioni di inizializzazione
module.exports = {
  pool, 
  waitForDatabase,
  createUsersTableIfNotExists
}
