const fs = require("fs")
const bcrypt = require("bcrypt")
const { sendVerificationEmail, reset } = require("./sendVerification")
const { generaTokenEmail, verificaTokenEmail } = require("./jwtUtils")

class UsersComponent {
  constructor(statePath) {
    this.users = {}
    this.statePath = statePath

    try {
      const data = fs.readFileSync(statePath, "utf-8")
      this.users = JSON.parse(data)

      if (typeof this.users !== "object" || Array.isArray(this.users)) {
        console.warn("Il file JSON non contiene un oggetto valido. Resetto.")
        this.users = {}
      }
    } catch (err) {
      console.log("Errore nel caricamento di state.json:", err.message)
      this.users = {}
    }
  }

  serialize() {
    fs.writeFileSync(this.statePath, JSON.stringify(this.users, null, 2))
  }

  async create(data) {
    const { email, password } = data

    if (this.exists(email)) {
      throw new Error("L'utente esiste già")
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    // struttura JSON pulita con verify come oggetto
    this.users[email] = {
      password: hashedPassword,
      verify: {
        verified: false,
        lastEmailSent: 0
      }
    }

    const jwtToken = generaTokenEmail(email)

    try {
      await sendVerificationEmail(email, jwtToken)
      console.log(`Email di verifica inviata a ${email}`)
      this.serialize()
    } catch (err) {
      console.error("Errore nell'invio dell'email:", err)
      delete this.users[email]
      throw new Error("Errore nell'invio dell'email di verifica.")
    }
  }

  login(email, password) {
    const user = this.users[email]
    if (!user) return false

    if (!user.verify?.verified) {
      console.log(`Utente ${email} non verificato`)
      return false
    }

    return bcrypt.compareSync(password, user.password)
  }

  exists(email){
    const user = this.users[email]
    return !!user
  }


  //reset password
  async resetPassword(email){
    const user = this.users[email]

    if (!user) {
    throw new Error("Utente non trovato")
    }
    if (!user.verify) {
      throw new Error("Account non verificato")
    }

    const resetToken = generaTokenEmail(email)
    try {
          await reset(email, resetToken)
          console.log(`Email di recupero password inviata a ${email}`)
    } catch (err) {
          console.error("Errore nell'invio dell'email:", err)
          throw new Error("Errore nell'invio dell'email di recupero.")
        }

    }
  
    changePassword(token, newPassword) {
      let email
      try {
        const decoded = verificaTokenEmail(token)
        email = decoded.email
      } catch (err) {
        throw new Error("Token non valido o scaduto")
      }

      const user = this.users[email]
      if (!user) {
        throw new Error("Utente non trovato")
      }

      user.password = bcrypt.hashSync(newPassword, 10)
      this.serialize()
    }
}

module.exports = UsersComponent
