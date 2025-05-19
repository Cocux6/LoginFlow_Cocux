document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-form")
  const message = document.getElementById("message")
  const token = new URLSearchParams(window.location.search).get("token")

  const passwordInput = document.getElementById("new-password")
  const togglePsw = document.getElementById("toggle-password")

  togglePsw.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password"
    passwordInput.type = isPassword ? "text" : "password"
  })

  if (!token) {
    message.textContent = "Token mancante o non valido."
    form.style.display = "none"
    return
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const newPassword = passwordInput.value

    const res = await fetch("/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    })

    const pswCheck = newPassword.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    if (!pswCheck) {
      message.textContent = "La password deve avere almeno 8 caratteri e contenere un simbolo speciale."
      message.style.color = "red"
      return
    }

    const data = await res.json()
    message.textContent = data.message || data.error
    if(res.ok){
        message.style.color = "green"
        setTimeout(() => {
        window.location.href = "/login"
        }, 3000)
    } else {
        message.style.color = "red"
    }
    

    
  })
})
