document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-form")
  const message = document.getElementById("message")
  const token = new URLSearchParams(window.location.search).get("token")

  const passwordInput = document.getElementById("new-password")
  const togglePsw = document.getElementById("toggle-password")

  // Mostra o nasconde la password
  togglePsw.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password"
    passwordInput.type = isPassword ? "text" : "password"
  })

  // Se il token non è presente nell'URL, mostra errore
  if (!token) {
    message.textContent = "Token mancante o non valido."
    form.style.display = "none"
    return
  }

  // Gestione invio del form
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const newPassword = passwordInput.value

    // Validazione della password
    const pswCheck = newPassword.length >= 8 
      && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) // Controllo lunghezza e se contiene un carattere speciale
    if (!pswCheck) {
      message.textContent = "La password deve avere almeno 8 caratteri e contenere un simbolo speciale."
      message.style.color = "red"
      return
    }

    // Invio della richiesta al server per aggiornare la password
    const res = await fetch("/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    })

    const data = await res.json()

    message.textContent = data.message || data.error // Password aggiornata con successo

    if (res.ok) {
      message.style.color = "green"
      // Reindirizza al login dopo 3 secondi
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    } else {
      message.style.color = "red"
    }
  })
})
