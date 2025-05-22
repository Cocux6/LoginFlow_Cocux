const bcrypt = require("bcrypt");
const { pool } = require("./db");
const { generaTokenEmail, verificaTokenEmail } = require("./jwtUtils");
const { sendVerificationEmail } = require("./emailManager");


  //CREATE
async function create({ email, password }) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    await pool.query(
      "INSERT INTO users (email, password, verified, last_email_sent) VALUES (?, ?, false, NULL)",
      [email, hashedPassword]
    );

    await sendVerificationEmail(email);
    console.log(`Email di verifica inviata a ${email}`);
  }

  //LOGIN
  async function login(user, password) {

    if(!user)
      return false

    if (!user.verified) {
      console.log("Account non verificato");
      return false;
    }

    return bcrypt.compareSync(password, user.password);
  }


  //CHANGE
  async function changePassword(token, newPassword) {
    const { valid, email, error } = verificaTokenEmail(token);
    if (!valid) throw new Error("Token non valido o scaduto");

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);
  }



module.exports = {
  create,
  login,
  changePassword
}
