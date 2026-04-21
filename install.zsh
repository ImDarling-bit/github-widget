#!/zsh

# Création des dossiers cibles s'ils n'existent pas
mkdir -p css js

print "--- Installation du GitHub Widget (macOS) ---"

# Téléchargement du CSS vers le dossier css/
curl -L https://raw.githubusercontent.com/ImDarling-bit/github-widget/refs/heads/main/widget/github-widget.css -o css/github-widget.css

# Téléchargement du JS vers le dossier js/
curl -L https://raw.githubusercontent.com/ImDarling-bit/github-widget/refs/heads/main/widget/github-widget.js -o js/github-widget.js

print "Installation terminée !"
print "Fichiers créés : css/github-widget.css et js/github-widget.js"
