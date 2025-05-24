document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")

  const emailInput = form.querySelector('input[name="email"]')
  const passwordInput = form.querySelector('input[name="password"]')
  const confirmInput = document.getElementById("confirm-password")

  const togglePsw = document.getElementById("toggle-password")
  const toggleConfPsw = document.getElementById("toggle-ConfPassword")

  const errorMsg = document.getElementById("error-message")
  const strengthBar = document.getElementById("strength-fill")
  const loadingMsg = document.getElementById("loading-msg")

  // Mostra o nasconde la password
  togglePsw.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password"
    passwordInput.type = isPassword ? "text" : "password"
  })

  // Mostra o nasconde la conferma password
  toggleConfPsw.addEventListener("click", () => {
    const isConfPassword = confirmInput.type === "password"
    confirmInput.type = isConfPassword ? "text" : "password"
  })

  // Gestione dell'invio del form di registrazione
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value
    const confirm = confirmInput.value

    errorMsg.textContent = ""
    loadingMsg.style.display = "block"

    // Verifica che la password sia sufficientemente sicura
    const pswCheck = password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password) // Contiene carattere speciale
    if (!pswCheck) {
      errorMsg.textContent = "La password deve avere almeno 8 caratteri e contenere un simbolo speciale."
      loadingMsg.style.display = "none"
      return
    }

    // Verifica che la password e la conferma coincidano
    if (password !== confirm) {
      errorMsg.textContent = "Le password non coincidono."
      loadingMsg.style.display = "none"
      return
    }

    // Invio dei dati al server
    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        window.location.href = "/verify.html" // Reindirizza dopo registrazione riuscita
      } else {
        errorMsg.textContent = data.error || "Registrazione fallita"
        loadingMsg.style.display = "none"
      }
    } catch (err) {
      console.error("Errore:", err)
      errorMsg.textContent = "Errore di rete"
      loadingMsg.style.display = "none"
    }
  })

  // Aggiorna la barra di forza della password mentre l’utente digita
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value
    const strength = calculateStrength(password)

    const percent = (strength.score / 5) * 100
    strengthBar.style.width = percent + "%"
    strengthBar.style.backgroundColor = strength.color
  })

  // Funzione che calcola la forza della password
  function calculateStrength(password) {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

    let color = "red"
    if (score === 2) color = "orange"
    else if (score === 3) color = "#f0c000"
    else if (score === 4) color = "#2196F3"
    else if (score === 5) color = "#4CAF50"

    return { score, color }
  }
})
