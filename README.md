# GitHub Widget

> A zero-dependency, drop-in widget that displays live GitHub repository information on any web page.

**Languages:** English | [Français](fr_FR-README.md)

**Demo :** [Widget](https://imdarling-bit.github.io/github-widget/)

---

## Preview

The widget renders a card with 5 tabs pulled directly from the GitHub API:

| Tab | Content |
|-----|---------|
| **Code** | Expandable file tree |
| **Commits** | Last 20 commits with author avatar |
| **Releases** | Latest releases with tag & date |
| **Pull Requests** | Open PRs |
| **README** | Rendered repository README |

---

## Quick Start

### Option A : One-liner (Fastest)
Run this command inside your project folder. It will create an `assets` directory, enter it, and download the necessary files:

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

### Option A : 3 steps. No npm. No build tools.

**1. Copy the files** to your project:
```
github-widget.css
github-widget.js
```

**2. Add the stylesheet** inside your `<head>`:
```html
<link rel="stylesheet" href="github-widget.css">
```

**3. Place the widget** anywhere in your page and add the script:
```html
<div data-github-widget="facebook/react"></div>

<script src="github-widget.js"></script>
```

That's it — the widget renders automatically.

---

## Usage

### Basic

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
  <link rel="stylesheet" href="github-widget.css">
</head>
<body>

  <div data-github-widget="torvalds/linux"></div>

  <script src="github-widget.js"></script>
</body>
</html>
```

### Multiple widgets on the same page

Every `[data-github-widget]` element is initialized independently.

```html
<div data-github-widget="vuejs/vue"></div>
<div data-github-widget="sveltejs/svelte"></div>
<div data-github-widget="denoland/deno"></div>
```

### Full GitHub URL as value

The widget accepts both `owner/repo` and full GitHub URLs:

```html
<div data-github-widget="https://github.com/microsoft/vscode"></div>
```

---

## Options

All options are set as HTML attributes on the element.

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `data-github-widget` | yes | Repository (`owner/repo` or full URL) | `"vercel/next.js"` |
| `data-theme` | no | Set to `"light"` for light mode | `data-theme="light"` |

### Light mode

```html
<div data-github-widget="tailwindlabs/tailwindcss" data-theme="light"></div>
```

---

## Theming

The widget uses CSS variables scoped to `.ghw-widget`. Override them to match your design:

```css
/* Dark custom theme */
.ghw-widget {
  --ghw-bg:        #1a1a2e;
  --ghw-header-bg: #16213e;
  --ghw-border:    #0f3460;
  --ghw-accent:    #e94560;   /* tab underline color */
  --ghw-link:      #e94560;
}
```

### All available variables

```css
.ghw-widget {
  --ghw-bg:          #0d1117;   /* card background */
  --ghw-header-bg:   #161b22;   /* header background */
  --ghw-border:      #30363d;   /* main borders */
  --ghw-border-sub:  #21262d;   /* subtle borders */
  --ghw-text:        #c9d1d9;   /* body text */
  --ghw-text-bright: #e6edf3;   /* headings / repo name */
  --ghw-text-muted:  #8b949e;   /* secondary text */
  --ghw-text-faint:  #484f58;   /* timestamps, meta */
  --ghw-accent:      #f78166;   /* active tab underline */
  --ghw-link:        #58a6ff;   /* links */
  --ghw-green:       #3fb950;   /* PR / release icon */
  --ghw-yellow:      #e3b341;   /* folder icon */
}
```

### Widget width

The widget is `100%` wide up to a `max-width` of `560px`. Override with a wrapper:

```html
<div style="max-width: 800px;">
  <div data-github-widget="owner/repo"></div>
</div>
```

---

## Framework Integration

The widget is plain HTML + CSS + JS — it works with any stack.

### PHP

```php
<?php if ($project['github_url']): ?>
<div data-github-widget="<?= htmlspecialchars($project['github_url']) ?>"></div>
<?php endif; ?>
```

### Django / Jinja2

```html
{% if project.github_url %}
<div data-github-widget="{{ project.github_url }}"></div>
{% endif %}
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
  // Re-init if widget was not present on first page load
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

> **Note:** In React/Vue SPAs, include the `<script>` tag in your HTML template (`index.html`) and call `window.GitHubWidget.init()` or `window.GitHubWidget.initWidget(element)` after mount.

### Next.js / Nuxt (SSR)

Add the CSS to your global stylesheet import, and load the script client-side only:

```js
// Next.js: pages/_app.js or app/layout.js
import 'path/to/github-widget.css'
```

```jsx
// In your component
useEffect(() => {
  import('path/to/github-widget.js')
}, [])
```

---

## JavaScript API

The script exposes a small global API for manual control:

```js
// Re-initialize all [data-github-widget] elements on the page
window.GitHubWidget.init()

// Initialize a specific element manually
const el = document.querySelector('#my-widget')
window.GitHubWidget.initWidget(el)
```

---

## Rate Limits

The widget uses the **unauthenticated** GitHub API, which allows **60 requests per hour** per IP address. Each widget initialization makes **5 API calls**.

If you need more requests, you can modify `github-widget.js` to include a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens):

```js
// Inside github-widget.js — ghFetch function
headers: {
  'Accept': '...',
  'Authorization': 'Bearer YOUR_TOKEN'   // ⚠ Do not expose tokens in public repos
}
```

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).  
Uses `fetch`, `Promise.all`, and `querySelectorAll` — no polyfills needed for modern targets.

---

## Files

| File | Description |
|------|-------------|
| `github-widget.js` | Widget logic — auto-initializes on load |
| `github-widget.css` | Styles — required, fully customizable |
| `index.html` | Standalone demo with URL input form |
| `app.js` + `style.css` | Demo app source |

---

## License

MIT — free to use, modify, and distribute.
