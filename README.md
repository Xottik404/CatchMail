# CatchMail 📬

**CatchMail** est une mini-application web ultra-rapide servant de boîte de réception "catch-all" pour recevoir des emails transactionnels (codes de vérification Discord, Steam, Epic Games, etc.) via un Webhook Inbound.

---

## ⚡ Fonctionnalités Clés

- **Endpoint Inbound Webhook (`/api/webhooks/inbound`)** : Compatible avec les formats courants (Resend, Postmark, webhooks personnalisés).
- **Détecteur OTP Automatique** : Détecte les codes de vérification à 4, 6 ou 8 chiffres dans le texte du mail et les affiche en gros avec un bouton de copie en 1 clic.
- **Copie rapide depuis la liste** : Chaque mail contenant un code affiche un badge cliquable pour copier l'OTP directement sans même ouvrir l'email.
- **Interface Dark Mode épurée** : Inspirée de Shadcn UI et Tailwind CSS, fluide et réactive.
- **Rafraîchissement en temps réel** : Mode rafraîchissement automatique toutes les 3 secondes pour intercepter les codes dès leur arrivée.
- **Stockage local ultra-léger** : Base de données locale persistante sans configuration requise (`data/emails.json`).

---

## 🏗️ Architecture du Projet

```text
MyMail/
├── data/
│   └── emails.json                 # Base de données locale (créée automatiquement)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── emails/
│   │   │   │   └── route.ts        # API interne pour lister / supprimer les emails
│   │   │   └── webhooks/
│   │   │       └── inbound/
│   │   │           └── route.ts    # Endpoint Webhook recevant les emails
│   │   ├── globals.css             # Styles Tailwind & thème Dark
│   │   ├── layout.tsx              # Root Layout Next.js
│   │   └── page.tsx                # Dashboard principal (Split Pane)
│   ├── components/
│   │   ├── CodeDetectorBanner.tsx  # Carte d'affichage & copie du code OTP
│   │   ├── EmailList.tsx           # Barre latérale avec liste des emails reçus
│   │   ├── EmailViewer.tsx         # Volet de lecture de l'email sélectionné
│   │   └── Header.tsx              # Barre d'en-tête, statut et actions
│   ├── lib/
│   │   ├── db.ts                   # Couche d'accès aux données locale
│   │   └── utils.ts                # Regex et extracteur de code OTP
│   └── types/
│       └── email.ts                # Types TypeScript
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── test-webhook.js                 # Script Node.js de test rapide
└── test-webhook.ps1                # Script PowerShell de test rapide
```

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```
Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🧪 Tester le Webhook en Local

### Option 1 : Utiliser le script Node.js fourni
Dans un terminal séparé, lancez :
```bash
node test-webhook.js
```

### Option 2 : Utiliser PowerShell (Windows)
```powershell
.\test-webhook.ps1
```

### Option 3 : Avec cURL
```bash
curl -X POST http://localhost:3000/api/webhooks/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Discord <noreply@discord.com>",
    "to": "test@catchmail.local",
    "subject": "Votre code de sécurité Discord",
    "text": "Bonjour ! Votre code de sécurité Discord est : 482910."
  }'
```

---

## 🌐 Exposer le Webhook à Internet (ex: Resend, Postmark)

Pour recevoir des vrais emails depuis un service en ligne comme Resend ou Postmark :

1. Lancez ngrok sur le port 3000 :
   ```bash
   ngrok http 3000
   ```
2. Récupérez l'URL publique générée (ex : `https://xyz.ngrok-free.app`).
3. Configurez votre fournisseur d'email (Inbound Webhook) avec l'URL :
   ```
   https://xyz.ngrok-free.app/api/webhooks/inbound
   ```
4. Tous les emails envoyés à votre domaine ou adresse de test apparaîtront en direct sur le Dashboard CatchMail !

