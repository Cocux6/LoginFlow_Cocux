require("dotenv").config()
const nodemailer = require("nodemailer")
const path = require("path")

// Importo le funzioni utili per gestire i token e il database
const { generaTokenEmail, verificaTokenEmail } = require("./jwtUtils")
const { getUserByEmail, setVerified, setNewSentTime } = require("./queryFunction")

// Funzione per inviare email di verifica account
async function sendVerificationEmail(email) {

  const token = generaTokenEmail(email) // Genero il token di verifica

  // Configuro il trasportatore SMTP usando Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // Imposto il contenuto dell'email di verifica
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifica il tuo account",
    html: `
      <h2>Ciao!</h2>
      <p>Grazie per esserti registrato alla nostra app.</p>
      <p>Per completare la registrazione, clicca qui:</p>
      <p><a href="http://localhost:8080/api/verify?token=${token}">Verifica il tuo account</a></p>
      <hr>
      <p>// — LoginFlow Team</p>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions) // Invio l'email
    console.log("Email inviata:", info.response)
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error) //in caso di errore:
    throw error
  }
}

// Verifica del token ricevuto via link e attivazione dell’account
async function verify(req, res) {
  const { token } = req.query

  if (!token)
    return res.send("<h1>Token mancante.</h1>")

  const { valid, email, error } = verificaTokenEmail(token)

  if (!valid) {
    return res.send(`<h1>Token non valido</h1><p>${error}</p>`)
  }

  const user = await getUserByEmail(email) // Recupero utente dal DB

  if (!user) return res.send("<h1>Utente non trovato</h1>")
  if (user.verified) return res.send("<h1>Account già verificato</h1>")

  await setVerified(email) // Marco l’utente come verificato

  
  const verifySuccessPath = path.resolve(__dirname, "public", "verifySuccess.html")
  res.sendFile(verifySuccessPath)
}

// Reinvio dell’email di verifica con cooldown anti-abuso
async function resend(res, email) {
  
  console.log("Email ricevuta per il resend:", email)

  const user = await getUserByEmail(email)

  if (!user) {
    return res.status(400).json({ error: "Utente non trovato" })
  }

  if (user.verified) {
    return res.status(400).json({ error: "Account già verificato" })
  }

  const now = Date.now()
  const cooldown = 60 * 1000 // 1 minuto di attesa
  const lastSent = user.last_email_sent || 0 // 0 se non esiste

  if (now - lastSent < cooldown) {
    const secondsLeft = Math.ceil((cooldown - (now - lastSent)) / 1000)
    return res.status(429).json({
      error: `Devi aspettare ${secondsLeft}s prima di richiedere un nuovo link`
    })
  }

  try {
    await sendVerificationEmail(email) // Invio l’email
    await setNewSentTime(email, now) // Aggiorno l’ora dell’ultimo invio
    res.json({ message: "Nuovo link di verifica inviato alla tua email" })
  } catch (err) {
    console.error("Errore nell'invio dell'email:", err)
    res.status(500).json({ error: "Errore nell'invio dell'email" })
  }
}

// Invia email per reimpostare la password
async function reset(user) {

  if (!user.verified) throw new Error("Account non verificato")

  const email = user.email
  const token = generaTokenEmail(email)
  const url = `http://localhost:8080/reset?token=${token}` //usato nella mail

  // Configuro il trasportatore per inviare l'email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reimposta la tua password",
    html: `
      <p>Hai richiesto di reimpostare la password.</p>
      <p>Clicca qui: <a href="${url}">${url}</a></p>
      <p>Questo link scade in 15 minuti.</p>
    `
  }

  await transporter.sendMail(mailOptions) // Invio email di reset
}

// Esporto tutte le funzioni per usarle nel server
module.exports = {
  sendVerificationEmail,
  verify,
  resend,
  reset
}
