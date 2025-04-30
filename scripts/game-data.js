document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("game-grid");
    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${game.thumb}" alt="${game.title}" class="thumb">
        <h3>${game.title}</h3>
        <a href="${game.url}" class="play-button">Play</a>
      `;
      container.appendChild(card);
    });
});

const games =
[
    {
        id: "blues-runner",
        title: "Blues Runner",
        thumb: "../image/blues-runner-thumb.png",
        url: "../browser-games/blues-runner/blues-runner.html"
    },
    {
        id: "chess",
        title: "Chess++",
        thumb: "../image/chess-thumb.png",
        url: "../browser-games/chess/chess.html"
    },
    {
        id: "pool",
        title: "Pool++",
        thumb: "../image/pool-thumb.png",
        url: "../browser-games/pool/pool.html"
    },
    {
        id: "snake",
        title: "Snake",
        thumb: "../image/snake-thumb.png",
        url: "../pages/browser-games/snake-game.html"
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        thumb: "../image/minesweeper-thumb.png",
        url: "../pages/browser-games/minesweeper-game.html"
    },
    {
        id: "lightsout",
        title: "Lights Out",
        thumb: "../image/lightsout-thumb.png",
        url: "../pages/browser-games/lightsout-game.html"
    },
    {
        id: "connectfour",
        title: "Connect Four",
        thumb: "../image/connectfour-thumb.png",
        url: "../pages/browser-games/connectfour-game.html"
    },
    {
        id: "memorymatch",
        title: "Memory Match",
        thumb: "../image/memorymatch-thumb.png",
        url: "../pages/browser-games/memorymatch-game.html"
    },
]