document.addEventListener("DOMContentLoaded", () => {

    const resendLink = document.getElementById("resendLink")
  const message = document.getElementById("message")

  resendLink.addEventListener("click", async () => {
    message.textContent = "Invio in corso..."
    message.style.color = "black"

    try {
      const res = await fetch("/api/resend", {
        method: "POST"
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
})