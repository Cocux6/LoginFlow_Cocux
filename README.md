# 🔐 Sistema di Autenticazione Web (Node.js)

Questo progetto è un'applicazione web semplice e completa per la gestione degli utenti, che include:

- Registrazione con verifica email
- Login solo per utenti verificati
- Recupero password via email (con token temporanei)
- Reset della password protetto con token JWT
- Sessioni utente (login/logout)
- Salvataggio persistente degli utenti in file JSON

---

## 🚀 Tecnologie utilizzate

- Node.js + Express
- Nodemailer (per l'invio email)
- bcrypt (per hashing password)
- JWT (per token di reset)
- HTML + CSS vanilla
- File system JSON locale (senza database)

---

## 📂 Struttura del progetto

\`\`\`
📁 public/
   ├─ login.html
   ├─ signup.html
   ├─ recover.html
   ├─ reset.html
   ├─ hub.html
   ├─ stylegpt.css
   └─ *.js (JS client-side)
📁 utils/
   └─ jwtUtils.js
📁 src/
   └─ UsersComponent.js
📄 server.js
📄 state.json
📄 .env
📄 README.md
\`\`\`

---

## ⚙️ Setup del progetto

1. Clona il repository:

\`\`\`bash
git clone https://github.com/tuonome/sistema-login.git
cd sistema-login
\`\`\`

2. Installa le dipendenze:

\`\`\`bash
npm install
\`\`\`

3. Crea un file \`.env\` con le seguenti variabili:

\`\`\`env
EMAIL_USER=tuobot@gmail.com
EMAIL_PASSWORD=la-tua-app-password
JWT_SECRET=una-stringa-a-caso
\`\`\`

> Se usi Gmail, attiva le App Password nel tuo account Google.

4. Avvia il server:

\`\`\`bash
node server.js
\`\`\`

5. Vai su [http://localhost:8080](http://localhost:8080)

---

## ✉️ Funzionalità email

- Viene inviata un'email di verifica al momento della registrazione.
- I link di reset password scadono dopo 15 minuti.
- Tutte le email sono inviate tramite Nodemailer (SMTP Gmail).

---

## 🔐 Sicurezza

- Le password sono salvate solo come hash bcrypt.
- I token di reset sono JWT firmati e con scadenza.
- L’utente può fare login solo dopo la verifica dell’account.

---

## 📌 To-do / Miglioramenti futuri

- Passaggio a database (es. MongoDB o SQLite)
- Rate limiting per evitare spam su /recover
- Pannello admin per gestione utenti
- Test automatici e copertura unitaria

---

## 📄 Licenza

Questo progetto è open-source e libero per uso personale, didattico o commerciale.  
Puoi adattarlo e ridistribuirlo come preferisci. Una ⭐ al repo è sempre gradita!
