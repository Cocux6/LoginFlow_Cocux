const form = document.getElementById("resendForm")
const message = document.getElementById("message")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value.trim().toLowerCase()

    try {
    const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })

    const data = await res.json()

    if (res.ok) {
        message.textContent = data.message
        message.style.color = "green"
    } else {
      message.textContent = data.error || "Errore sconosciuto"
      message.style.color = "red"
    }
    } catch (err) {
    message.textContent = "Errore nella richiesta"
    message.style.color = "red"
    console.error(err)
  }
})