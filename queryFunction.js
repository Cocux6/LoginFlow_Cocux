const { pool } = require("./db");

async function getUserByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) 
        return null
    return rows[0];
  }

async function exists(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows.length > 0;
  }

async function setVerified(email) {
  try {
    const [result] = await pool.query(
      "UPDATE users SET verified = true WHERE email = ?",
      [email]
    );

    console.log(`Utente ${email} verificato.`);
    return true;
  } catch (err) {
    console.error("Errore durante l'aggiornamento:", err);
    throw err;
  }
}

async function setNewSentTime(email, Timestamp) {
  try {
    const [result] = await pool.query(
      "UPDATE users SET last_email_sent = ? WHERE email = ?",
      [Timestamp, email]
    )

    console.log(`Utente ${email} verificato.`);
    return true;
  } catch (err) {
    console.error("Errore durante l'aggiornamento:", err);
    throw err;
  }
}

module.exports = {
  getUserByEmail,
  exists,
  setVerified,
  setNewSentTime
}