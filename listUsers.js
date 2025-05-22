require("dotenv").config()
const mysql = require("mysql2/promise")

async function listUsers() {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    const [rows] = await pool.query("SELECT * FROM users")

    if (rows.length === 0) {
      console.log("Nessun utente trovato nella tabella.")
    } else {
      console.log("Utenti trovati:")
      console.table(rows)
    }

    await pool.end()
  } catch (err) {
    console.error("Errore durante la connessione o la query:", err.message)
  }
}

listUsers()
