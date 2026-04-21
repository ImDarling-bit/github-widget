const API = "https://api.github.com";

let currentOwner = "";
let currentRepo = "";

const inputScreen = document.getElementById("input-screen");
const widget = document.getElementById("widget");
const repoUrlInput = document.getElementById("repo-url");
const loadBtn = document.getElementById("load-btn");
const errorMsg = document.getElementById("error-msg");
const backBtn = document.getElementById("back-btn");
const loadingIcon = document.getElementById("loading-icon");

function parseUrl(url) {
  const m = url.trim().match(/github\.com\/([^/?#\s]+)\/([^/?#\s]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

async function gh(path, accept = "application/vnd.github+json") {
  const r = await fetch(API + path, { headers: { Accept: accept } });
  if (r.status === 404) throw new Error("Dépôt introuvable ou privé");
  if (r.status === 403)
    throw new Error("Limite de l'API GitHub atteinte, réessayez plus tard");
  if (!r.ok) throw new Error(`Erreur ${r.status}`);
  return accept === "application/vnd.github.html+json" ? r.text() : r.json();
}

function setLoading(on) {
  loadingIcon.classList.toggle("active", on);
}

function timeAgo(dateStr) {
  const s = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}j`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} mois`;
  return `${Math.floor(mo / 12)} an(s)`;
}

const FOLDER_SVG = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1Z"/></svg>`;
const FOLDER_OPEN_SVG = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H14.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z"/></svg>`;
const FILE_SVG = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/></svg>`;

function renderTree(items, container, depth = 0) {
  const sorted = [...items].sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (const item of sorted) {
    const row = document.createElement("div");
    row.className = "tree-row";
    row.style.paddingLeft = `${8 + depth * 16}px`;

    const iconEl = document.createElement("span");
    iconEl.className = `tree-icon ${item.type}`;
    iconEl.innerHTML = item.type === "dir" ? FOLDER_SVG : FILE_SVG;

    const nameEl = document.createElement("span");
    nameEl.className = "tree-name";
    nameEl.textContent = item.name;

    row.append(iconEl, nameEl);
    container.appendChild(row);

    if (item.type === "dir") {
      const children = document.createElement("div");
      container.appendChild(children);

      let loaded = false;
      let open = false;

      row.addEventListener("click", async () => {
        open = !open;
        iconEl.innerHTML = open ? FOLDER_OPEN_SVG : FOLDER_SVG;
        children.style.display = open ? "block" : "none";

        if (open && !loaded) {
          loaded = true;
          const loader = document.createElement("div");
          loader.className = "tree-loader";
          loader.textContent = "…";
          children.appendChild(loader);
          try {
            const data = await gh(
              `/repos/${currentOwner}/${currentRepo}/contents/${item.path}`,
            );
            children.innerHTML = "";
            renderTree(data, children, depth + 1);
          } catch {
            loader.textContent = "Erreur";
          }
        }
      });

      children.style.display = "none";
    }
  }
}

function renderCommits(commits) {
  const list = document.getElementById("commits-list");
  list.innerHTML = "";
  for (const c of commits) {
    const item = document.createElement("div");
    item.className = "list-item";

    const avatar = document.createElement("img");
    avatar.className = "commit-avatar";
    avatar.src = c.author?.avatar_url ?? "";
    avatar.alt = "";

    const info = document.createElement("div");
    info.className = "list-info";

    const msg = document.createElement("div");
    msg.className = "list-title";
    msg.textContent = c.commit.message.split("\n")[0];

    const meta = document.createElement("div");
    meta.className = "list-meta";
    const author = c.author?.login ?? c.commit.author.name;
    meta.textContent = `${author} · il y a ${timeAgo(c.commit.author.date)}`;

    info.append(msg, meta);
    item.append(avatar, info);
    list.appendChild(item);
  }
}

function renderReleases(releases) {
  const list = document.getElementById("releases-list");
  list.innerHTML = "";
  if (!releases.length) {
    list.innerHTML = '<div class="empty-msg">Aucune release</div>';
    return;
  }
  for (const r of releases) {
    const item = document.createElement("div");
    item.className = "list-item";

    const iconEl = document.createElement("div");
    iconEl.className = "release-icon";
    iconEl.innerHTML = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 7.775V2.75a.25.25 0 0 1 .25-.25h5.025a.25.25 0 0 1 .177.073l6.25 6.25a.25.25 0 0 1 0 .354l-5.025 5.025a.25.25 0 0 1-.354 0l-6.25-6.25a.25.25 0 0 1-.073-.177Zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775ZM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>`;

    const info = document.createElement("div");
    info.className = "list-info";

    const name = document.createElement("div");
    name.className = "list-title";
    name.textContent = r.name || r.tag_name;

    const meta = document.createElement("div");
    meta.className = "list-meta";
    const pre = r.prerelease ? " · pre-release" : "";
    meta.textContent = `${r.tag_name} · il y a ${timeAgo(r.published_at)}${pre}`;

    info.append(name, meta);
    item.append(iconEl, info);
    list.appendChild(item);
  }
}

const PR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/></svg>`;

function renderPulls(pulls) {
  const list = document.getElementById("pulls-list");
  list.innerHTML = "";
  if (!pulls.length) {
    list.innerHTML = '<div class="empty-msg">Aucun PR ouvert</div>';
    return;
  }
  for (const pr of pulls) {
    const item = document.createElement("div");
    item.className = "pr";

    const iconEl = document.createElement("div");
    iconEl.className = "pr-icon";
    iconEl.innerHTML = PR_SVG;

    const text = document.createElement("div");
    text.className = "pr-text";

    const title = document.createElement("div");
    title.className = "pr-title";
    title.textContent = pr.title;

    const desc = document.createElement("div");
    desc.className = "pr-desc";
    desc.textContent = `#${pr.number} · il y a ${timeAgo(pr.created_at)} par ${pr.user.login}`;

    text.append(title, desc);
    item.append(iconEl, text);
    list.appendChild(item);
  }
}

async function renderReadme(owner, repo) {
  const el = document.getElementById("readme-content");
  el.innerHTML = '<div class="readme-loading">Chargement…</div>';
  try {
    const html = await gh(
      `/repos/${owner}/${repo}/readme`,
      "application/vnd.github.html+json",
    );
    el.innerHTML = html;
    el.querySelectorAll("a").forEach((a) => {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
    el.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http")) {
        img.src = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${src.replace(/^\//, "")}`;
      }
    });
  } catch {
    el.innerHTML = '<div class="empty-msg">Aucun README trouvé</div>';
  }
}

async function loadRepo(owner, repo) {
  setLoading(true);
  try {
    const [repoData, rootContents, commits, releases, pulls] =
      await Promise.all([
        gh(`/repos/${owner}/${repo}`),
        gh(`/repos/${owner}/${repo}/contents`),
        gh(`/repos/${owner}/${repo}/commits?per_page=20`),
        gh(`/repos/${owner}/${repo}/releases?per_page=10`),
        gh(`/repos/${owner}/${repo}/pulls?state=open&per_page=20`),
      ]);

    document.getElementById("repo-link").href = repoData.html_url;
    document.getElementById("owner-name").textContent = owner;
    document.getElementById("owner-name").href = repoData.owner.html_url;
    document.getElementById("repo-name-el").textContent = repo;
    document.getElementById("repo-name-el").href = repoData.html_url;
    document.getElementById("owner-avatar").style.backgroundImage =
      `url(${repoData.owner.avatar_url})`;

    const treeRoot = document.getElementById("tree-root");
    treeRoot.innerHTML = "";
    renderTree(Array.isArray(rootContents) ? rootContents : [], treeRoot);

    renderCommits(commits);
    renderReleases(releases);
    renderPulls(pulls);
    renderReadme(owner, repo);
  } finally {
    setLoading(false);
  }
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});

loadBtn.addEventListener("click", async () => {
  const parsed = parseUrl(repoUrlInput.value);
  if (!parsed) {
    errorMsg.textContent = "URL invalide. Ex : https://github.com/owner/repo";
    return;
  }
  errorMsg.textContent = "";
  loadBtn.disabled = true;
  currentOwner = parsed.owner;
  currentRepo = parsed.repo;

  try {
    await loadRepo(parsed.owner, parsed.repo);
    inputScreen.classList.add("hidden");
    widget.classList.remove("hidden");

    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));
    document.querySelector('[data-tab="code"]').classList.add("active");
    document.getElementById("panel-code").classList.add("active");
  } catch (e) {
    errorMsg.textContent = e.message;
  } finally {
    loadBtn.disabled = false;
  }
});

repoUrlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadBtn.click();
});

backBtn.addEventListener("click", () => {
  widget.classList.add("hidden");
  inputScreen.classList.remove("hidden");
});
