document.addEventListener("DOMContentLoaded", () => {
    const isGitHub = location.hostname.includes("github.io");
    const BASE = isGitHub ? "/your-repo-name" : "";

    const header = document.getElementById("site-header");
    const footer = document.getElementById("footer");
  
    if (header) {
      header.innerHTML = `
        <a href="${BASE}/index.html"><img src="${BASE}/image/homepage.png" alt="Home"/></a>
        <nav class="main-nav">
          <a href="${BASE}/pages/codlivion.html">Codlivion</a>
          <a href="${BASE}/pages/codream.html">CoDream</a>
          <a href="${BASE}/pages/browser-games/browser-games.html">Browser Games</a>
        </nav>
      `;
    }
  
    if (footer) {
      footer.innerHTML = `
        <footer>© Ahmet Fatih Görgülü</footer>
      `;
    }
  });