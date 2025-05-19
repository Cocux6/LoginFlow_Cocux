require("dotenv").config()
const nodemailer = require("nodemailer")
const path = require("path")
const { generaTokenEmail, verificaTokenEmail } = require("./jwtUtils")

async function sendVerificationEmail(email, token) {
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
    const info = await transporter.sendMail(mailOptions)
    console.log("Email inviata:", info.response)
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error)
    throw error
  }
}

//VERIFICA MAIL
function verify(req, res, usersComponent) {
  const { token } = req.query

  if (!token)
    return res.send("<h1>Token mancante.</h1>")

  const { valid, email, error } = verificaTokenEmail(token)

  if (!valid) {
    return res.send(`<h1>Token non valido</h1><p>${error}</p>`)
  }

  const user = usersComponent.users[email]

  if (!user) return res.send("<h1>Utente non trovato</h1>")
  if (user.verify.verified) return res.send("<h1>Account già verificato</h1>")

  user.verify.verified = true
  usersComponent.serialize()

  const verifySuccessPath = path.resolve(__dirname, "public", "verifySuccess.html")
  res.sendFile(verifySuccessPath)
}


//RESEND
async function resend(req, res, usersComponent) {
  const { email } = req.body
  console.log("Email ricevuta per il resend:", email)

  const user = usersComponent.users[email]

  if (!user) {
    return res.status(400).json({ error: "Utente non trovato" })
  }

  if (user.verify.verified) {
    return res.status(400).json({ error: "Account già verificato" })
  }

  const now = Date.now()
  const cooldown = 60 * 1000
  const lastSent = user.verify.lastEmailSent
  if (now - lastSent < cooldown) {
    const secondsLeft = Math.ceil((cooldown - (now - lastSent)) / 1000)
    return res.status(429).json({
      error: `Devi aspettare ${secondsLeft}s prima di richiedere un nuovo link`
    })
  }

  const token = generaTokenEmail(email)

  try {
    await sendVerificationEmail(email, token)
    user.verify.lastEmailSent = now
    usersComponent.serialize()
    res.json({ message: "Nuovo link di verifica inviato alla tua email" })
  } catch (err) {
    console.error("Errore nell'invio dell'email:", err)
    res.status(500).json({ error: "Errore nell'invio dell'email" })
  }
}

async function reset(email, token){
  const url = `http://localhost:8080/reset?token=${token}`

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

  await transporter.sendMail(mailOptions)
}

module.exports = {
  sendVerificationEmail,
  verify,
  resend,
  reset
}
