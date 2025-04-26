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
        url: "../../browser-games/blues-runner/blues-runner.html",
        jsFile: "../browser-games/blues-runner/bluesrunnerpge.js"
    },
    {
        id: "snake",
        title: "Snake",
        thumb: "../image/snake-thumb.png",
        url: "../browser-games/snake-game.html",
        jsFile: "../browser-games/snake.js"
    },
    {
        id: "minesweeper",
        title: "Minesweeper",
        thumb: "../image/minesweeper-thumb.png",
        url: "../browser-games/minesweeper-game.html",
        jsFile: "../browser-games/minesweeper.js"
    },
    {
        id: "lightsout",
        title: "Lights Out",
        thumb: "../image/lightsout-thumb.png",
        url: "../browser-games/lightsout-game.html",
        jsFile: "../browser-games/lightsout.js"
    },
    {
        id: "connectfour",
        title: "Connect Four",
        thumb: "../image/connectfour-thumb.png",
        url: "../browser-games/connectfour-game.html",
        jsFile: "../browser-games/connectfour.js"
    },
    {
        id: "memorymatch",
        title: "Memory Match",
        thumb: "../image/memorymatch-thumb.png",
        url: "../browser-games/memorymatch-game.html",
        jsFile: "../browser-games/memorymatch.js"
    },
]