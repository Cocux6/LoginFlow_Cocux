const { pool } = require("./db")

// Recupera un utente dal database in base all’email
async function getUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
  if (rows.length === 0) 
    return null
  return rows[0]
}

// Verifica se un utente esiste già nel database
async function exists(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
  return rows.length > 0
}

// Imposta l’utente come verificato nel database
async function setVerified(email) {
  try {
    const [result] = await pool.query(
      "UPDATE users SET verified = true WHERE email = ?",
      [email]
    )

    console.log(`Utente ${email} verificato.`)
    return true
  } catch (err) {
    console.error("Errore durante l'aggiornamento della verifica:", err)
    throw err
  }
}

// Aggiorna il timestamp dell’ultima email inviata
async function setNewSentTime(email, timestamp) {
  try {
    const [result] = await pool.query(
      "UPDATE users SET last_email_sent = ? WHERE email = ?",
      [timestamp, email]
    )

    console.log(`Aggiornato timestamp per ${email}`)
    return true
  } catch (err) {
    console.error("Errore durante l'aggiornamento del timestamp:", err)
    throw err
  }
}

// Esportazione delle funzioni
module.exports = {
  getUserByEmail,
  exists,
  setVerified,
  setNewSentTime
}
