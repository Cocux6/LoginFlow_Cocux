// Esegui il codice quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")
  const emailInput = form.querySelector('input[name="email"]')
  const passwordInput = form.querySelector('input[name="password"]')
  const togglePsw = document.getElementById("toggle-password")
  const errorMessage = document.getElementById("error-message")

  // Tasto per mostrare/nascondere la password
  togglePsw.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password"
    passwordInput.type = isPassword ? "text" : "password"
  })

  // Gestione dell'invio del form di login
  form.addEventListener("submit", async (e) => {
    e.preventDefault() // Evita il ricaricamento della pagina

    // Recupera i valori inseriti
    const email = emailInput.value
    const password = passwordInput.value

    try {
      // Invio dei dati al server tramite fetch
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        // Login riuscito: reindirizza alla pagina riservata
        window.location.href = "/hub"
      } else {
        // Login fallito: mostra il messaggio di errore
        errorMessage.textContent = data.error || "Credenziali errate"
      }
    } catch (err) {
      // Errore di rete o connessione al server
      errorMessage.textContent = "Errore di connessione al server"
      console.log(err)
    }
  })
})
