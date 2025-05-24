const jwt = require("jsonwebtoken")

// Chiave segreta per firmare i token (presa dalle variabili d'ambiente)
const JWTSECRET = process.env.JWT

// Genera un token JWT con l'email, valido per 15 minuti
function generaTokenEmail(email) {
  return jwt.sign(
    { email },          // Payload: oggetto con l'email
    JWTSECRET,          // Chiave segreta
    { expiresIn: "15m" } // Durata del token
  )
}

// Verifica un token JWT e ne estrae l'email se è valido
function verificaTokenEmail(token) {
  try {
    const payload = jwt.verify(token, JWTSECRET) // Decodifica e verifica il token
    return { valid: true, email: payload.email } // Se valido, restituisce l'email
  } catch (err) {
    return { valid: false, error: err.message }  // Se non valido, ritorna l'errore
  }
}

// Esportazione delle funzioni per l’uso in altri file
module.exports = {
  generaTokenEmail,
  verificaTokenEmail
}
