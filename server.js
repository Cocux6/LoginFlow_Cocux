// https://chatgpt.com/share/67e70e2a-6dc8-8012-b8bc-5679b9f7665e

const express = require("express")
const path = require("path")
const session = require("express-session")

const UsersComponent = require("./UsersComponent")
const { verify, resend } = require("./sendVerification")

const app = new express()
const PORT = 8080

const usersComponent = new UsersComponent("./state.json")

app.use(session({
  secret: process.env.SESSIONKEY,
  resave: false,
  saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())




app.get(["/" ,"/login"], (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"))
})



app.post("/login", (req, res) => {
  const { email, password } = req.body
  if (usersComponent.login(email, password)) {
    req.session.user = email
    res.json({ success: true })
  } else {
    res.status(401).json({ error: "Credenziali errate o account non verificato" })
  }
})


app.get("/recover", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/recover.html"))
})

app.post("/recover", async (req, res) => {
  const { email } = req.body

  try {
    await usersComponent.resetPassword(email)
    res.json({ message: "Email inviata correttamente" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})


app.get("/reset", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/reset.html"))
})

app.post("/reset", (req, res) => {
  const { token, newPassword } = req.body
  try {
    usersComponent.changePassword( token, newPassword)
    res.json({ message: "Password aggiornata con successo, ti stiamo reindirizzando al login" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})



app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"))
})



app.post("/signup", async (req, res) => {
  const { email, password } = req.body

  if (usersComponent.exists(email)) {
    return res.status(400).json({ error: "Account già esistente" })
  }

  try {
    await usersComponent.create({ email, password })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Errore durante la registrazione" })
  }
})




//uso di requireLogin in /hub
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

app.get("/hub", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/hub.html"))
})



//logout dalla session
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Errore nel logout")
    }
    res.redirect("/login") 
  })
})


app.get("/verify", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/verify.html"))
})


app.get("/api/verify", (req, res) => {
  verify(req, res, usersComponent)
})


app.post("/api/resend", requireLogin, async (req, res) => {
  resend(req, res, usersComponent)
})



app.use((req, res) => {
  res.status(404).send("Pagina non trovata")
})




app.listen(PORT, () => console.log(`server listening on port ${PORT}: http://localhost:8080/`))
