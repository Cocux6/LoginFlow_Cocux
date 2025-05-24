# 🔐 Sistema di Autenticazione Web (Node.js + MySQL + Docker)

Questo progetto è un'applicazione web completa per la gestione sicura degli utenti, con funzionalità moderne:

- Registrazione con verifica email
- Login consentito solo dopo la verifica
- Recupero password via email (con token JWT)
- Reset protetto della password
- Sessioni persistenti con Express-session
- Salvataggio utenti in MySQL (via Docker)

---

## 🚀 Tecnologie utilizzate

- Node.js + Express
- MySQL 8.0 (con Docker)
- Nodemailer (per invio email)
- bcrypt (per hashing sicuro delle password)
- JWT (per token di verifica/reset)
- HTML + CSS + JS client-side
- phpMyAdmin (per visualizzazione DB)

---

## 📂 Struttura del progetto

```
📁 public/
   ├─ login.html
   ├─ signup.html
   ├─ recover.html
   ├─ reset.html
   ├─ verify.html
   ├─ hub.html
   ├─ style.css
   └─ *.js (client-side)
📁 mysql-init/
   └─ init.sql
📄 db.js
📄 emailManager.js
📄 UsersComponent.js
📄 queryFunction.js
📄 jwtUtils.js
📄 index.js
📄 Dockerfile
📄 docker-compose.yml
📄 .env
📄 README.md
```

---

## ⚙️ Setup locale (senza Docker)

1. Clona il repository:

```bash
git clone https://github.com/tuonome/sistema-login.git
cd sistema-login
```

2. Installa le dipendenze:

```bash
npm install
```

3. Crea un file `.env` con le seguenti variabili:

```env
EMAIL_USER=tuoemail@gmail.com
EMAIL_PASSWORD=la-tua-password-app
SESSIONKEY=chiave-sessione
JWT=chiave-per-jwt
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tuapasswordmysql
DB_NAME=logindb
```

> ⚠️ Se usi Gmail, abilita le App Password nel tuo account.

4. Avvia MySQL separatamente, assicurati che il DB esista, poi avvia il server:

```bash
node index.js
```

5. Vai su [http://localhost:8080](http://localhost:8080)

---

## 🐳 Setup con Docker (consigliato)

1. Crea un file `.env` con le variabili seguenti:

```env
DB_NAME=logindb
DB_USER=loginuser
DB_PASSWORD=loginpass
DB_ROOT_PASSWORD=rootpass
DB_HOST=mysql
SESSIONKEY=chiave-sessione
EMAIL_USER=tuoemail@gmail.com
EMAIL_PASSWORD=la-tua-password-app
JWT=chiave-per-jwt
```

2. Avvia tutto con Docker:

```bash
docker-compose up --build
```

3. Vai su:
- App: [http://localhost:8080](http://localhost:8080)
- PhpMyAdmin: [http://localhost:8081](http://localhost:8081)  
  (Server: `mysql`, User: `loginuser`, Password: `loginpass`)

---

## ✉️ Funzionalità email

- L'email di verifica viene inviata alla registrazione
- I token per il reset scadono dopo 15 minuti
- Le email vengono inviate tramite SMTP Gmail (via Nodemailer)

---

## 🔐 Sicurezza

- Password salvate come hash con bcrypt
- Token JWT con firma e scadenza
- Login possibile solo dopo verifica dell’account
- Protezione contro invii ripetuti (rate limit base)

---

## 📄 Licenza

Questo progetto è open-source, gratuito per scopi educativi, personali o commerciali.  
Modificalo liberamente.
