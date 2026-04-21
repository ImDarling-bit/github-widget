(function () {
  'use strict';

  var API = 'https://api.github.com';

  var ICON = {
    github:
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-2.23c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.49A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z"/></svg>',
    folder:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1Z"/></svg>',
    folderOpen:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H14.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z"/></svg>',
    file:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.024-.025-2.914-2.914Z"/></svg>',
    commit:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H1.75a.75.75 0 0 1 0-1.5h2.32a4.002 4.002 0 0 1 7.86 0h2.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/></svg>',
    release:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 7.775V2.75a.25.25 0 0 1 .25-.25h5.025a.25.25 0 0 1 .177.073l6.25 6.25a.25.25 0 0 1 0 .354l-5.025 5.025a.25.25 0 0 1-.354 0l-6.25-6.25a.25.25 0 0 1-.073-.177Zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775ZM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>',
    pr:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/></svg>',
    readme:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.062 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"/></svg>',
    code:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/></svg>',
    spinner:
      '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5a6.5 6.5 0 1 0 6.5 6.5.75.75 0 0 1 1.5 0 8 8 0 1 1-8-8 .75.75 0 0 1 0 1.5Z"/></svg>',
  };

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function ago(d) {
    var s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60)   return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    var days = Math.floor(s / 86400);
    if (days < 30)  return days + 'd ago';
    if (days < 365) return Math.floor(days / 30) + 'mo ago';
    return Math.floor(days / 365) + 'y ago';
  }

  function div(cls, html) {
    var el = document.createElement('div');
    el.className = cls;
    if (html !== undefined) el.innerHTML = html;
    return el;
  }

  function parseRepo(value) {
    var m = value.match(/github\.com\/([^/?#\s]+)\/([^/?#\s]+)/);
    if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
    m = value.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (m) return { owner: m[1], repo: m[2] };
    return null;
  }

  function ghFetch(path, html) {
    return fetch(API + path, {
      headers: { Accept: html
        ? 'application/vnd.github.html+json'
        : 'application/vnd.github+json' }
    }).then(function(r) {
      if (!r.ok) throw new Error('GitHub ' + r.status);
      return html ? r.text() : r.json();
    });
  }

  function buildShell(container, id) {
    var tabs = [
      { key: 'code',     label: 'Code',         icon: 'code'    },
      { key: 'commits',  label: 'Commits',       icon: 'commit'  },
      { key: 'releases', label: 'Releases',      icon: 'release' },
      { key: 'pulls',    label: 'Pull Requests', icon: 'pr'      },
      { key: 'readme',   label: 'README',        icon: 'readme'  },
    ];

    var tabsHtml = tabs.map(function(t, i) {
      return '<button class="ghw-tab' + (i === 0 ? ' ghw-active' : '') + '" data-tab="' + t.key + '">' +
        '<span class="ghw-tab-icon">' + ICON[t.icon] + '</span>' + esc(t.label) +
      '</button>';
    }).join('');

    var panesHtml = tabs.map(function(t) {
      return '<div class="ghw-pane ghw-scroll" id="' + id + '-' + t.key + '" style="display:none"></div>';
    }).join('');

    container.innerHTML =
      '<div class="ghw-widget">' +
        '<div class="ghw-header">' +
          '<div class="ghw-top">' +
            '<a class="ghw-gh-icon" id="' + id + '-link" href="#" target="_blank" rel="noopener" aria-label="Open on GitHub">' +
              ICON.github +
            '</a>' +
            '<div class="ghw-meta">' +
              '<div class="ghw-pfp" id="' + id + '-pfp"></div>' +
              '<a class="ghw-owner" id="' + id + '-owner" href="#" target="_blank" rel="noopener"></a>' +
              '<span class="ghw-slash">/</span>' +
              '<a class="ghw-repo-name" id="' + id + '-repo" href="#" target="_blank" rel="noopener"></a>' +
            '</div>' +
            '<span class="ghw-space"></span>' +
            '<div class="ghw-spinner ghw-hidden" id="' + id + '-spin">' + ICON.spinner + '</div>' +
          '</div>' +
          '<div class="ghw-tabs" id="' + id + '-tabs">' + tabsHtml + '</div>' +
        '</div>' +
        '<div class="ghw-body">' +
          '<div class="ghw-status" id="' + id + '-status">Loading…</div>' +
          panesHtml +
        '</div>' +
      '</div>';
  }

  function initTabs(container, id) {
    var tabEls  = container.querySelectorAll('.ghw-tab');
    var paneEls = container.querySelectorAll('.ghw-pane');

    function show(key) {
      tabEls.forEach(function(t) { t.classList.toggle('ghw-active', t.dataset.tab === key); });
      paneEls.forEach(function(p) { p.style.display = p.id === id + '-' + key ? 'flex' : 'none'; });
    }

    tabEls.forEach(function(t) {
      t.addEventListener('click', function() { show(t.dataset.tab); });
    });

    show('code');
  }

  function renderTree(items, container, owner, repo, depth) {
    items.sort(function(a, b) {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    items.forEach(function(item) {
      var row = div('ghw-tree-row');
      row.style.paddingLeft = (8 + depth * 16) + 'px';

      var ico = div('ghw-tree-icon ' + item.type, ICON[item.type === 'dir' ? 'folder' : 'file']);
      var lbl = div('ghw-tree-label');
      lbl.textContent = item.name;
      row.appendChild(ico); row.appendChild(lbl);
      container.appendChild(row);

      if (item.type === 'dir') {
        var sub = div('');
        sub.style.display = 'none';
        container.appendChild(sub);
        var loaded = false, open = false;

        row.addEventListener('click', function(e) {
          e.stopPropagation();
          open = !open;
          ico.innerHTML = ICON[open ? 'folderOpen' : 'folder'];
          sub.style.display = open ? 'block' : 'none';
          if (open && !loaded) {
            loaded = true;
            sub.innerHTML = '<div class="ghw-tree-loader">…</div>';
            ghFetch('/repos/' + owner + '/' + repo + '/contents/' + item.path)
              .then(function(data) {
                sub.innerHTML = '';
                renderTree(data, sub, owner, repo, depth + 1);
              })
              .catch(function() { sub.innerHTML = '<div class="ghw-tree-loader" style="color:#f85149">Error</div>'; });
          }
        });
      }
    });
  }

  function renderCommits(data, pane) {
    data.forEach(function(c) {
      var row = div('ghw-list-row');
      var img = document.createElement('img');
      img.className = 'ghw-avatar';
      img.src = (c.author && c.author.avatar_url) || '';
      img.alt = '';
      var info = div('ghw-list-info',
        '<div class="ghw-list-title">' + esc(c.commit.message.split('\n')[0]) + '</div>' +
        '<div class="ghw-list-meta">' + esc(c.author ? c.author.login : c.commit.author.name) + ' · ' + ago(c.commit.author.date) + '</div>'
      );
      row.appendChild(img); row.appendChild(info);
      pane.appendChild(row);
    });
  }

  function renderReleases(data, pane) {
    if (!data.length) { pane.appendChild(div('ghw-empty', 'No releases yet.')); return; }
    data.forEach(function(r) {
      var row = div('ghw-list-row');
      row.innerHTML =
        '<div class="ghw-release-ico">' + ICON.release + '</div>' +
        '<div class="ghw-list-info">' +
          '<div class="ghw-list-title">' + esc(r.name || r.tag_name) + '</div>' +
          '<div class="ghw-list-meta">' + esc(r.tag_name) + ' · ' + ago(r.published_at) + (r.prerelease ? ' · pre-release' : '') + '</div>' +
        '</div>';
      pane.appendChild(row);
    });
  }

  function renderPulls(data, pane) {
    if (!data.length) { pane.appendChild(div('ghw-empty', 'No open pull requests.')); return; }
    data.forEach(function(pr) {
      var row = div('ghw-pr-row');
      row.innerHTML =
        '<div class="ghw-pr-ico">' + ICON.pr + '</div>' +
        '<div class="ghw-pr-info">' +
          '<div class="ghw-pr-title">' + esc(pr.title) + '</div>' +
          '<div class="ghw-pr-meta">#' + pr.number + ' · ' + ago(pr.created_at) + ' · ' + esc(pr.user.login) + '</div>' +
        '</div>';
      pane.appendChild(row);
    });
  }

  function renderReadme(owner, repo, pane) {
    pane.innerHTML = '<div class="ghw-empty">Loading README…</div>';
    ghFetch('/repos/' + owner + '/' + repo + '/readme', true)
      .then(function(html) {
        pane.innerHTML = html;
        pane.querySelectorAll('a').forEach(function(a) {
          a.target = '_blank'; a.rel = 'noopener noreferrer';
        });
        pane.querySelectorAll('img').forEach(function(img) {
          var src = img.getAttribute('src');
          if (src && !/^https?:\/\//.test(src)) {
            img.src = 'https://raw.githubusercontent.com/' + owner + '/' + repo + '/HEAD/' + src.replace(/^\//, '');
          }
        });
      })
      .catch(function() { pane.innerHTML = '<div class="ghw-empty">No README found.</div>'; });
  }

  function initWidget(container) {
    var value = container.getAttribute('data-github-widget');
    var parsed = parseRepo(value);
    if (!parsed) {
      container.textContent = '[github-widget] Invalid repo: "' + value + '"';
      return;
    }
    var owner = parsed.owner, repo = parsed.repo;
    var id = 'ghw-' + Math.random().toString(36).slice(2, 9);

    buildShell(container, id);

    var widget  = container.querySelector('.ghw-widget');
    var spinner = document.getElementById(id + '-spin');
    var status  = document.getElementById(id + '-status');
    var pCode    = document.getElementById(id + '-code');
    var pCommits = document.getElementById(id + '-commits');
    var pRel     = document.getElementById(id + '-releases');
    var pPulls   = document.getElementById(id + '-pulls');
    var pReadme  = document.getElementById(id + '-readme');

    if (container.hasAttribute('data-theme') && container.getAttribute('data-theme') === 'light') {
      widget.classList.add('ghw-light');
    }

    spinner.classList.remove('ghw-hidden');

    Promise.all([
      ghFetch('/repos/' + owner + '/' + repo),
      ghFetch('/repos/' + owner + '/' + repo + '/contents'),
      ghFetch('/repos/' + owner + '/' + repo + '/commits?per_page=20'),
      ghFetch('/repos/' + owner + '/' + repo + '/releases?per_page=10'),
      ghFetch('/repos/' + owner + '/' + repo + '/pulls?state=open&per_page=20'),
    ]).then(function(results) {
      var repoData = results[0], rootContents = results[1],
          commits  = results[2], releases     = results[3], pulls = results[4];

      document.getElementById(id + '-link').href  = repoData.html_url;
      document.getElementById(id + '-pfp').style.backgroundImage = 'url(' + repoData.owner.avatar_url + ')';
      var ownerEl = document.getElementById(id + '-owner');
      ownerEl.textContent = owner; ownerEl.href = repoData.owner.html_url;
      var repoEl = document.getElementById(id + '-repo');
      repoEl.textContent = repo; repoEl.href = repoData.html_url;

      if (Array.isArray(rootContents)) renderTree(rootContents, pCode, owner, repo, 0);
      renderCommits(commits, pCommits);
      renderReleases(releases, pRel);
      renderPulls(pulls, pPulls);
      renderReadme(owner, repo, pReadme);

      status.style.display = 'none';
      initTabs(container, id);

    }).catch(function(err) {
      status.className = 'ghw-status ghw-error';
      status.textContent = 'Error: ' + err.message;
    }).finally(function() {
      spinner.classList.add('ghw-hidden');
    });
  }

  function init() {
    document.querySelectorAll('[data-github-widget]').forEach(initWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GitHubWidget = { init: init, initWidget: initWidget };

})();
