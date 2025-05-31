// Esegui il codice quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recover-form")
  const message = document.getElementById("message")

  // Gestione alla pressione di submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault() // Evita il ricaricamento della pagina

    const email = document.getElementById("email").value

    try {
      // Invia la richiesta POST al server con l'email inserita
      const res = await fetch("/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      // Mostra il messaggio ricevuto dal server
      message.textContent = data.message || data.error // Email inviata correttamente o error se data.message non esiste
      message.style.color = res.ok ? "green" : "red"
    } catch (err) {
      // Gestione di eventuali errori di rete
      message.textContent = "Errore di connessione al server"
      message.style.color = "red"
    }
  })
})
