# Création des dossiers
New-Item -ItemType Directory -Force -Path "css", "js"

Write-Host "Téléchargement des fichiers du widget..." -ForegroundColor Cyan

# Téléchargement du CSS
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ImDarling-bit/github-widget/refs/heads/main/widget/github-widget.css" -OutFile "css/github-widget.css"

# Téléchargement du JS
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ImDarling-bit/github-widget/refs/heads/main/widget/github-widget.js" -OutFile "js/github-widget.js"

Write-Host "Installation terminée avec succès !" -ForegroundColor Green
