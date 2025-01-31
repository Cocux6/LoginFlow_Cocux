const express = require("express")
const path = require("path")
const session = require("express-session")
const UsersComponent = require("./UsersComponent")
const app = new express()
const PORT = 8080

const usersComponent = new UsersComponent("./state.json")

app.use(session({
  secret: "super-secret-key", //da cambiare
  resave: false,
  saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get(["/" ,"/login"], (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"))
})

app.post("/login", (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  if(usersComponent.login(email, password)){
    req.session.user = email
    res.redirect("/hub")
  } else {
    //non trovato
    res.status(401).send("Credenziali errate")
  }
})

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"))
})

app.post("/signup", (req, res) => {
  console.log(req.body)
  usersComponent.create(req.body)
  res.redirect("/login")
})

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
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Errore nel logout")
    }
    res.redirect("/login") 
  })
})

app.use((req, res) => {
  res.status(404).send("Pagina non trovata")
})

app.listen(PORT, () => console.log("server listening on port", PORT))
