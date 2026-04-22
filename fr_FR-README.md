# GitHub Widget

> Un widget sans dépendance à glisser-déposer dans n'importe quelle page web pour afficher des informations GitHub en direct.

**Langues :** [English](README.md) | Français

**Démo :** [Widget](https://imdarling-bit.github.io/github-widget/)

---

## Aperçu

Le widget affiche une carte avec 5 onglets alimentés directement par l'API GitHub :

| Onglet | Contenu |
|--------|---------|
| **Code** | Arborescence des fichiers (dépliable) |
| **Commits** | Les 20 derniers commits avec avatar |
| **Releases** | Dernières versions avec tag et date |
| **Pull Requests** | PRs ouvertes |
| **README** | README du dépôt rendu en HTML |

---

## Démarrage rapide

### Option A : Installation en une ligne (Le plus rapide)
Exécutez cette commande à la racine de votre projet. Elle créera un dossier `assets`, s'y déplacera, et téléchargera les fichiers requis :

**Linux :**
```bash
curl -sSL https://raw.githubusercontent.com/ImDarling-bit/github-widget/main/install.sh | bash
```

**MacOS :**
```zsh
curl -sSL https://raw.githubusercontent.com/ImDarling-bit/github-widget/main/install.zsh | zsh
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/ImDarling-bit/github-widget/main/install.ps1 | iex
```

### Option B : 3 étapes. Sans npm. Sans outil de build.

**1. Copiez les fichiers** dans votre projet :
```
github-widget.css
github-widget.js
```

**2. Ajoutez la feuille de style** dans votre `<head>` :
```html
<link rel="stylesheet" href="github-widget.css">
```

**3. Placez le widget** n'importe où dans votre page, puis ajoutez le script :
```html
<div data-github-widget="facebook/react"></div>

<script src="github-widget.js"></script>
```

C'est tout — le widget se charge automatiquement.

---

## Utilisation

### Basique

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ma page</title>
  <link rel="stylesheet" href="github-widget.css">
</head>
<body>

  <div data-github-widget="torvalds/linux"></div>

  <script src="github-widget.js"></script>
</body>
</html>
```

### Plusieurs widgets sur la même page

Chaque élément `[data-github-widget]` est initialisé indépendamment.

```html
<div data-github-widget="vuejs/vue"></div>
<div data-github-widget="sveltejs/svelte"></div>
<div data-github-widget="denoland/deno"></div>
```

### URL GitHub complète comme valeur

Le widget accepte `owner/repo` ou une URL GitHub complète :

```html
<div data-github-widget="https://github.com/microsoft/vscode"></div>
```

---

## Options

Toutes les options sont définies sous forme d'attributs HTML sur l'élément.

| Attribut | Requis | Description | Exemple |
|----------|--------|-------------|---------|
| `data-github-widget` | oui | Dépôt (`owner/repo` ou URL complète) | `"vercel/next.js"` |
| `data-theme` | non | `"light"` pour le thème clair | `data-theme="light"` |

### Mode clair

```html
<div data-github-widget="tailwindlabs/tailwindcss" data-theme="light"></div>
```

---

## Personnalisation

Le widget utilise des variables CSS scopées à `.ghw-widget`. Modifiez-les pour correspondre à votre design :

```css
/* Thème sombre personnalisé */
.ghw-widget {
  --ghw-bg:        #1a1a2e;
  --ghw-header-bg: #16213e;
  --ghw-border:    #0f3460;
  --ghw-accent:    #e94560;   /* couleur du soulignement de l'onglet actif */
  --ghw-link:      #e94560;
}
```

### Toutes les variables disponibles

```css
.ghw-widget {
  --ghw-bg:          #0d1117;   /* fond de la carte */
  --ghw-header-bg:   #161b22;   /* fond du header */
  --ghw-border:      #30363d;   /* bordures principales */
  --ghw-border-sub:  #21262d;   /* bordures subtiles */
  --ghw-text:        #c9d1d9;   /* texte principal */
  --ghw-text-bright: #e6edf3;   /* titres / nom du dépôt */
  --ghw-text-muted:  #8b949e;   /* texte secondaire */
  --ghw-text-faint:  #484f58;   /* dates, métadonnées */
  --ghw-accent:      #f78166;   /* soulignement onglet actif */
  --ghw-link:        #58a6ff;   /* liens */
  --ghw-green:       #3fb950;   /* icône PR / release */
  --ghw-yellow:      #e3b341;   /* icône dossier */
}
```

### Largeur du widget

Le widget fait `100%` de largeur jusqu'à `max-width: 560px`. Modifiez-le via un wrapper :

```html
<div style="max-width: 800px;">
  <div data-github-widget="owner/repo"></div>
</div>
```

---

## Intégration par framework / langage

Le widget est du HTML + CSS + JS pur — il fonctionne avec n'importe quelle stack.

### PHP

```php
<?php if (!empty($projet['lien']) && strpos($projet['lien'], 'github.com') !== false): ?>
<div data-github-widget="<?= htmlspecialchars($projet['lien']) ?>"></div>
<?php endif; ?>
```

### Django / Jinja2

```html
{% if project.github_url %}
<div data-github-widget="{{ project.github_url }}"></div>
{% endif %}
```

### Laravel / Blade

```blade
@if($project->github_url)
  <div data-github-widget="{{ $project->github_url }}"></div>
@endif
```

### Vue 3

```html
<template>
  <div :data-github-widget="repoUrl"></div>
</template>

<script setup>
import { onMounted } from 'vue'

const repoUrl = 'owner/repo'

onMounted(() => {
  // Ré-initialiser si le widget n'était pas présent au premier chargement
  if (window.GitHubWidget) window.GitHubWidget.init()
})
</script>
```

### React

```jsx
import { useEffect, useRef } from 'react'

export default function GithubWidget({ repo }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && window.GitHubWidget) {
      window.GitHubWidget.initWidget(ref.current)
    }
  }, [repo])

  return <div ref={ref} data-github-widget={repo} />
}
```

> **Note :** Dans les SPA React/Vue, incluez la balise `<script>` dans votre template HTML (`index.html`) et appelez `window.GitHubWidget.init()` ou `window.GitHubWidget.initWidget(element)` après le montage du composant.

### Next.js / Nuxt (SSR)

Importez le CSS dans votre feuille de style globale, et chargez le script uniquement côté client :

```js
// Next.js : pages/_app.js ou app/layout.js
import 'chemin/vers/github-widget.css'
```

```jsx
// Dans votre composant
useEffect(() => {
  import('chemin/vers/github-widget.js')
}, [])
```

---

## API JavaScript

Le script expose une petite API globale pour le contrôle manuel :

```js
// Ré-initialiser tous les éléments [data-github-widget] de la page
window.GitHubWidget.init()

// Initialiser manuellement un élément spécifique
const el = document.querySelector('#mon-widget')
window.GitHubWidget.initWidget(el)
```

---

## Limites de l'API GitHub

Le widget utilise l'API GitHub **non authentifiée**, qui autorise **60 requêtes par heure** par adresse IP. Chaque initialisation de widget effectue **5 appels API**.

Si vous avez besoin de plus de requêtes, modifiez la fonction `ghFetch` dans `github-widget.js` pour inclure un [token d'accès personnel](https://docs.github.com/fr/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) :

```js
// Dans github-widget.js — fonction ghFetch
headers: {
  'Accept': '...',
  'Authorization': 'Bearer VOTRE_TOKEN'   // ⚠ Ne pas exposer dans un dépôt public
}
```

---

## Compatibilité navigateurs

Fonctionne sur tous les navigateurs modernes (Chrome, Firefox, Safari, Edge).  
Utilise `fetch`, `Promise.all` et `querySelectorAll` — aucun polyfill nécessaire.

---

## Fichiers du projet

| Fichier | Description |
|---------|-------------|
| `github-widget.js` | Logique du widget — auto-initialisation au chargement |
| `github-widget.css` | Styles — requis, entièrement personnalisable |
| `index.html` | Démo autonome avec champ de saisie d'URL |
| `app.js` + `style.css` | Sources de la démo |

---

## Attribution

Ce projet est open source sous la **Licence MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer — mais un crédit est requis dans les cas suivants :

### Si vous utilisez le widget sur votre site ou application

Ajoutez un lien visible vers le dépôt original dans votre page ou documentation :

```html
<!-- GitHub Widget par Noah | _ImDarling_ — https://github.com/ImDarling-bit/github-widget -->
```

Ou en pied de page / section "à propos" :

```
GitHub Widget par _ImDarling_ (https://github.com/ImDarling-bit/github-widget)
```

### Si vous forkez le dépôt

- Conservez la notice de copyright originale dans le fichier `LICENSE`.
- Mentionnez le projet et l'auteur originaux dans votre `README` :

```markdown
Basé sur [github-widget](https://github.com/ImDarling-bit/github-widget) par Noah | _ImDarling_
```

### Ce qui n'est PAS requis

- Vous n'avez **pas** besoin de créditer pour un usage privé ou interne.
- Vous n'avez **pas** besoin de rendre votre propre projet open source pour utiliser ce widget.

---

## Licence

MIT © 2026 Noah | _ImDarling_

La licence MIT autorise l'utilisation, la modification et la distribution libres. La notice de copyright (ci-dessus) et cette licence doivent être conservées dans toutes les copies ou parties substantielles du logiciel. Voir [LICENSE](LICENSE) pour le texte complet.
