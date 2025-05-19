// public/recover.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recover-form")
  const message = document.getElementById("message")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value

    try {
      const res = await fetch("/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      message.textContent = data.message || data.error
      message.style.color = res.ok ? "green" : "red"
    } catch (err) {
      message.textContent = "Errore di connessione al server"
      message.style.color = "red"
    }
  })
})
