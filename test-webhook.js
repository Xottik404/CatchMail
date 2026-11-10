/**
 * Script de test local pour CatchMail
 * Exécution: node test-webhook.js
 */

const testPayloads = [
  {
    name: "Discord Verification Code (6 chiffres)",
    data: {
      from: "Discord <noreply@discord.com>",
      to: "test-user@catchmail.local",
      subject: "Votre code de sécurité Discord",
      text: "Bonjour ! Votre code de vérification Discord est : 918273. Il expirera dans 10 minutes.",
      date: new Date().toISOString(),
    },
  },
  {
    name: "Epic Games 2FA (6 chiffres)",
    data: {
      from: "Epic Games Support <help@epicgames.com>",
      to: "fortnite-player@catchmail.local",
      subject: "Code d'authentification à deux facteurs",
      text: "Voici votre code de sécurité à deux facteurs pour votre compte Epic Games : 384729\nNe partagez ce code avec personne.",
      date: new Date().toISOString(),
    },
  },
  {
    name: "Format Postmark (8 chiffres)",
    data: {
      From: "Security Auth <security@service.io>",
      To: "developer@catchmail.local",
      Subject: "Your Device Authorization Code",
      TextBody: "Please enter the one-time authorization code: 58291043 to access your account.",
      Date: new Date().toISOString(),
    },
  },
];

async function sendTestWebhook() {
  const targetUrl = process.env.WEBHOOK_URL || "http://127.0.0.1:3000/api/webhooks/inbound";

  // Choisir un payload aléatoire ou le premier
  const selected = testPayloads[Math.floor(Math.random() * testPayloads.length)];

  console.log(`Envoi du test [${selected.name}] vers ${targetUrl}...`);

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selected.data),
    });

    const result = await response.json();
    console.log("Statut HTTP:", response.status);
    console.log("Réponse:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("\n Succès ! L'email a été reçu et enregistré.");
      if (result.email?.extractedCode) {
        console.log(` Code OTP extrait avec succès: ${result.email.extractedCode}`);
      }
    } else {
      console.error("\n Erreur reçue du serveur.");
    }
  } catch (error) {
    console.error("\n Erreur de connexion. Assurez-vous que le serveur Next.js tourne (npm run dev).");
    console.error("Détail:", error.message);
  }
}

sendTestWebhook();

