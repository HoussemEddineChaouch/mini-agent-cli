/* TABS */
function switchTab(btn, id) {
  document
    .querySelectorAll(".install-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".install-body")
    .forEach((b) => (b.style.display = "none"));
  btn.classList.add("active");
  document.getElementById(id).style.display = "block";
}

/* COPY*/
function copyInstall(btn) {
  const text = [
    "git clone https://github.com/HoussemEddineChaouch/mini-agent-cli.git",
    "cd mini-agent-cli",
    "npm install",
    "node src/index.js",
  ].join("\n");
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "copied ✓";
    btn.style.color = "var(--green)";
    setTimeout(() => {
      btn.textContent = "copy";
      btn.style.color = "";
    }, 2000);
  });
}

/* CONTRIBUTORS*/
async function loadContributors() {
  const grid = document.getElementById("contrib-grid");
  const loading = document.getElementById("contrib-loading");
  try {
    const res = await fetch(
      "https://api.github.com/repos/HoussemEddineChaouch/mini-agent-cli/contributors",
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    loading.remove();
    data.forEach((c) => {
      const card = document.createElement("a");
      card.href = c.html_url;
      card.target = "_blank";
      card.rel = "noopener";
      card.className = "person-card";
      card.innerHTML = `
        <img class="person-avatar" src="${c.avatar_url}" alt="${c.login}"
          onerror="this.style.background='var(--surface2)';this.src=''" />
        <div>
          <div class="person-name">@${c.login}</div>
          <div class="person-commits">${c.contributions} commit${c.contributions > 1 ? "s" : ""}</div>
        </div>`;
      grid.appendChild(card);
    });
  } catch {
    loading.textContent = "could not load — view on GitHub.";
  }
}

/* STATS */
async function loadStats() {
  try {
    const [repoRes, contribRes, issuesRes] = await Promise.all([
      fetch("https://api.github.com/repos/HoussemEddineChaouch/mini-agent-cli"),
      fetch(
        "https://api.github.com/repos/HoussemEddineChaouch/mini-agent-cli/contributors",
      ),
      fetch(
        "https://api.github.com/repos/HoussemEddineChaouch/mini-agent-cli/issues?state=closed&per_page=100",
      ),
    ]);
    if (repoRes.ok) {
      const repo = await repoRes.json();
      const el = document.getElementById("stat-stars");
      if (el) el.textContent = repo.stargazers_count ?? "–";
    }
    if (contribRes.ok) {
      const c = await contribRes.json();
      const el = document.getElementById("stat-contrib");
      if (el) el.textContent = c.length;
    }
    if (issuesRes.ok) {
      const issues = await issuesRes.json();
      const el = document.getElementById("stat-issues");
      if (el) el.textContent = issues.length + "+";
    }
  } catch {}
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  loadContributors();
  loadStats();
});
