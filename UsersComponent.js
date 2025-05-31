const bcrypt = require("bcrypt")
const { pool } = require("./db")
const { verificaTokenEmail } = require("./jwtUtils")
const { sendVerificationEmail } = require("./emailManager")

// Funzione per creare un nuovo utente
async function create({ email, password }) {
  // Hasher della password con salt di 10 cicli
  const hashedPassword = bcrypt.hashSync(password, 10)

  // Inserimento dell’utente nel database (non ancora verificato)
  await pool.query(
    "INSERT INTO users (email, password, verified, last_email_sent) VALUES (?, ?, false, NULL)",
    [email, hashedPassword]
  )

  // Invio dell’email di verifica all’indirizzo fornito
  await sendVerificationEmail(email)
  console.log(`Email di verifica inviata a ${email}`)
}

// Funzione di login: verifica credenziali e stato dell'account
async function login(user, password) {

  // Controllo se l’utente esiste
  if (!user)
    return false

  // Controllo se l’utente ha verificato l’email
  if (!user.verified) {
    console.log("Account non verificato")
    return false
  }

  // Verifica della password con hash bcrypt
  return bcrypt.compareSync(password, user.password) 
}

// Cambio password tramite token ricevuto via email
async function changePassword(token, newPassword) {
  // Decodifica e verifica del token
  const { valid, email, error } = verificaTokenEmail(token)

  if (!valid) throw new Error("Token non valido o scaduto")

  // Hash della nuova password
  const hashedPassword = bcrypt.hashSync(newPassword, 10)

  // Aggiornamento della password nel database
  await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email])
}

// Esporto le funzioni per l’uso nel server
module.exports = {
  create,
  login,
  changePassword
}
