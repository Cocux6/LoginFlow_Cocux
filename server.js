const express = require("express")
const path = require("path")
const session = require("express-session")

// Importazione delle funzioni relative agli utenti e alla gestione email
const { create, login, changePassword } = require("./UsersComponent")
const { verify, resend, reset } = require("./emailManager")
const { getUserByEmail, exists } = require("./queryFunction")

const db = require("./db")

const app = new express()
const PORT = 8080

// Configurazione della sessione (salva le info dell'utente tra le richieste)
app.use(session({
  secret: process.env.SESSIONKEY,
  resave: false,
  saveUninitialized: false
}))

// parsing di URL encoded, JSON e file statici
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())


// Login e pagina iniziale
app.get(["/", "/login"], (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"))
})

// Gestione login utente
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await getUserByEmail(email)

  //controllo password per il login
  if (await login(user, password)) {
    req.session.user = email // Salvo l'email nella sessione
    res.json({ success: true })
  } else {
    res.status(401).json({ error: "Credenziali errate o account non verificato" })
  }
})

// Pagina per il recupero password
app.get("/recover", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/recover.html"))
})

// Richiesta di reset password via email
app.post("/recover", async (req, res) => {
  const { email } = req.body
  
  const user = await getUserByEmail(email)

  try {
    await reset(user) // Invio email di reset
    res.json({ message: "F" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Pagina per inserire nuova password
app.get("/reset", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/reset.html"))
})

// Endpoint per cambiare la password
app.post("/reset", async (req, res) => {
  const { token, newPassword } = req.body
  try {
    await changePassword(token, newPassword)
    res.json({ message: "Password aggiornata con successo, ti stiamo reindirizzando al login" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Pagina di registrazione
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"))
})

// Gestione registrazione utente
app.post("/signup", async (req, res) => {
  const { email, password } = req.body

  try {
    //controllo se esiste già la mail nel db
    if (await exists(email)) {
      return res.status(400).json({ error: "Account già esistente" })
    }

    await create({ email, password }) // Crea nuovo utente
    req.session.user = email // Salva email nella sessione
    res.json({ success: true })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Errore durante la registrazione" })
  }
})

// funzione che fa un controllo sulla sessione, se falso riporta al login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

// Pagina di benvenuto
app.get("/hub", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/hub.html"))
})

// Logout dell’utente e distruzione della sessione
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Errore nel logout")
    }
    res.redirect("/login")
  })
})

// Pagina per la verifica account
app.get("/verify", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/verify.html"))
})

// Endpoint per verificare account
app.get("/api/verify", (req, res) => {
  verify(req, res)
})

// Reinvio email di verifica (richiede di aver eseguito il signup)
app.post("/api/resend", requireLogin, async (req, res) => {
  let email = req.session.user
  await resend(res, email)
})

// Gestione 404 per tutte le altre rotte
app.use((req, res) => {
  res.status(404).send("Pagina non trovata")
})

// Avvio del server dopo aver preparato il database
async function main() {
  await db.waitForDatabase()
  await db.createUsersTableIfNotExists()

  app.listen(PORT, () => console.log(`server listening on port ${PORT}: http://localhost:${PORT}/`))
}

main()
