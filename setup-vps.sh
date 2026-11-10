#!/bin/bash
# ==============================================================================
# Script d'installation automatique CatchMail & Hub Hebertik sur VPS Linux (Ubuntu / Debian)
# Usage : chmod +x setup-vps.sh && sudo ./setup-vps.sh
# ==============================================================================

set -e

echo "🚀 [1/6] Mise à jour du système..."
apt update && apt upgrade -y
apt install -y curl git ufw nginx certbot python3-certbot-nginx

echo "📦 [2/6] Installation de Node.js 20 LTS & PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

npm install -g pm2

echo "⚙️ [3/6] Installation des dépendances et build du projet..."
npm install
npm run build

echo "🌐 [4/6] Configuration Nginx pour hebertik.fr et mail.hebertik.fr..."
cp nginx-hebertik.conf /etc/nginx/sites-available/hebertik
ln -sf /etc/nginx/sites-available/hebertik /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo "🛡️ [5/6] Configuration du Firewall (UFW)..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "🔄 [6/6] Démarrage de l'application avec PM2..."
pm2 start ecosystem.config.js || pm2 restart catchmail-hub
pm2 save
pm2 startup

echo ""
echo "=============================================================================="
echo "✅ Installation terminée avec succès !"
echo "Pour activer le SSL (HTTPS gratuit Let's Encrypt), assurez-vous que vos DNS"
echo "pointent bien vers ce VPS, puis lancez simplement :"
echo ""
echo "   sudo certbot --nginx -d hebertik.fr -d www.hebertik.fr -d mail.hebertik.fr"
echo ""
echo "Vos URLs sont prêtes :"
echo "  - https://hebertik.fr      -> Hub Hebertik"
echo "  - https://mail.hebertik.fr -> CatchMail (Boîte & OTP)"
echo "  - Webhook Resend           -> https://mail.hebertik.fr/api/webhooks/inbound"
echo "=============================================================================="

