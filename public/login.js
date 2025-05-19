document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")
  const emailInput = form.querySelector('input[name="email"]')
  const passwordInput = form.querySelector('input[name="password"]')
  const togglePsw = document.getElementById("toggle-password")
  const errorMessage = document.getElementById("error-message")

  //  visibilità password
  togglePsw.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password"
    passwordInput.type = isPassword ? "text" : "password"
  })
  

  //  gestione login
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = emailInput.value
    const password = passwordInput.value

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        window.location.href = "/hub"
      } else {
        errorMessage.textContent = data.error || "Credenziali errate"
      }
    } catch (err) {
      errorMessage.textContent = "Errore di connessione al server"
      console.log(err)
    }
  })
})
