#!/bin/bash

# Création des dossiers s'ils n'existent pas
mkdir -p css js

echo "Téléchargement des fichiers du widget..."

# Téléchargement du CSS
curl -s https://raw.githubusercontent.com/ImDarling-bit/github-widget/main/github-widget.css -o css/github-widget.css

# Téléchargement du JS
curl -s https://raw.githubusercontent.com/ImDarling-bit/github-widget/main/github-widget.js -o js/github-widget.js

echo "Installation terminée : /css/github-widget.css et /js/github-widget.js sont prêts."
