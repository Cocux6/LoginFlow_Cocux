const jwt = require("jsonwebtoken")

const JWTSECRET = process.env.JWT

function generaTokenEmail(email) {
    return jwt.sign(
        { email },
      JWTSECRET,
      { expiresIn: "15m" }
    )
  }

  function verificaTokenEmail(token) {
    try {
      const payload = jwt.verify(token, JWTSECRET)
      return { valid: true, email: payload.email }
    } catch (err) {
      return { valid: false, error: err.message }
    }
  }


  module.exports = {
    generaTokenEmail,
    verificaTokenEmail
  }