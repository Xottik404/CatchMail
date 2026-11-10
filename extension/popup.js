const API_BASE = "http://localhost:3000";

const btnGenerate = document.getElementById("btnGenerate");
const accountBox = document.getElementById("accountBox");
const emailValue = document.getElementById("emailValue");
const passValue = document.getElementById("passValue");
const latestOtpBox = document.getElementById("latestOtpBox");
const otpCode = document.getElementById("otpCode");
const otpSubject = document.getElementById("otpSubject");
const toast = document.getElementById("toast");

function showToast(msg) {
  toast.innerText = msg;
  setTimeout(() => {
    toast.innerText = "";
  }, 2200);
}

// 1. Générer une nouvelle boîte en 1 clic
btnGenerate.addEventListener("click", async () => {
  btnGenerate.innerText = "Génération...";
  try {
    const res = await fetch(`${API_BASE}/api/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ random: true }),
    });
    const data = await res.json();
    if (res.ok && data.account) {
      emailValue.innerText = data.account.address;
      passValue.innerText = data.account.password;
      accountBox.style.display = "block";

      // Copie automatique de l'email
      await navigator.clipboard.writeText(data.account.address);
      showToast("Email généré & copié !");
    } else {
      showToast("Erreur serveur");
    }
  } catch (err) {
    showToast("Serveur local injoignable (npm run dev)");
  } finally {
    btnGenerate.innerHTML = "<span>🎲 Nouvelle Boîte Aléatoire</span>";
  }
});

// Copie au clic sur l'email
emailValue.addEventListener("click", async () => {
  if (emailValue.innerText) {
    await navigator.clipboard.writeText(emailValue.innerText);
    showToast("Email copié !");
  }
});

// Copie au clic sur le mot de passe
passValue.addEventListener("click", async () => {
  if (passValue.innerText) {
    await navigator.clipboard.writeText(passValue.innerText);
    showToast("Mot de passe copié !");
  }
});

// Copie au clic sur le code OTP
otpCode.addEventListener("click", async () => {
  if (otpCode.innerText) {
    await navigator.clipboard.writeText(otpCode.innerText);
    showToast("Code OTP copié !");
  }
});

// 2. Récupérer le dernier email / code reçu
async function fetchLatestCode() {
  try {
    const res = await fetch(`${API_BASE}/api/emails`);
    if (res.ok) {
      const data = await res.json();
      const list = data.emails || [];
      const codeEmail = list.find((e) => e.extractedCode);
      if (codeEmail) {
        otpCode.innerText = codeEmail.extractedCode;
        otpSubject.innerText = codeEmail.subject;
        latestOtpBox.style.display = "block";
      }
    }
  } catch (e) {
    // Ignore if offline
  }
}

fetchLatestCode();

