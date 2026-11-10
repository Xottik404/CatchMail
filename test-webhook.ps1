# Script de test PowerShell pour CatchMail
$body = @{
    from = "Discord Security <noreply@discord.com>"
    to = "gamer@catchmail.local"
    subject = "Votre code de sécurité Discord"
    text = "Bonjour ! Voici votre code de sécurité Discord : 482910. Ne le partagez avec personne."
    date = (Get-Date).ToString("o")
} | ConvertTo-Json

Write-Host "Envoi d'un email de test vers http://127.0.0.1:3000/api/webhooks/inbound..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/webhooks/inbound" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    Write-Host "Succès !" -ForegroundColor Green
    $response | Format-List
} catch {
    Write-Host "Erreur lors de l'appel au Webhook : $($_.Exception.Message)" -ForegroundColor Red
}

