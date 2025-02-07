const fs = require("fs")
const bcrypt = require("bcrypt")


class UsersComponent {
  constructor(statePath) {
    this.users = []
    this.statePath = statePath

    try {
      const data = fs.readFileSync(statePath, "utf-8")
      this.users = JSON.parse(data)

      if (!Array.isArray(this.users)) {
        console.warn("Il file JSON non contiene un array. Rendo vuoto.")
        this.users = []
      }
    } catch (err) {
      console.log("Errore nel caricamento di state.json:", err.message)
      this.users = [] 
    }
  }


  serialize() {
    fs.writeFileSync(this.statePath, JSON.stringify(this.users, null, 2))
  }

  create(data) {
    const { email, password } = data

    const hashedPassword = bcrypt.hashSync(password, 10)
    const verificationToken = crypto.randomBytes(32).toString("hex")

    if (this.users.some(user => user.email === email)) {
      throw new Error("L'utente esiste già")
    }

    this.users.push({email: email, password: hashedPassword, verify: false, verificationToken})
    this.serialize()

    this.sendVerificationEmail(email, verificationToken)
  
  }

  sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "progettobello@gmail.com", // Inserisci la tua email
        pass: "tua-password-app" // Usa una password per app (non la password normale)
      }
    })
  }

  login(email, password) {
    const user = this.users.find(user => user.email === email)


    return user && bcrypt.compareSync(password, user.password)
  }
}

module.exports = UsersComponent