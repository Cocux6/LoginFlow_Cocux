document.addEventListener("DOMContentLoaded", () => {

  const resendLink = document.getElementById("resendLink")
  const message = document.getElementById("message")

  // Quando l'utente clicca il paragrafo, invia la richiesta al server
  resendLink.addEventListener("click", async () => {
    message.textContent = "Invio in corso..."
    message.style.color = "black"

    try {
      const res = await fetch("/api/resend", {
        method: "POST"
      })

      const data = await res.json()

      if (res.ok) {
        // Email inviata con successo
        message.textContent = data.message
        message.style.color = "green"
      } else {
        // Errore restituito dal server
        message.textContent = data.error || "Errore sconosciuto" // Errore nell'invio della mail
        message.style.color = "red"
      }
    } catch (err) {
      // Errore di rete o connessione
      message.textContent = "Errore nella richiesta"
      message.style.color = "red"
      console.error(err)
    }
  })
})
