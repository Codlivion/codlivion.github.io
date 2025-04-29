document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("codream-list");
    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "codream-card";
      card.innerHTML = `
        <img src="${game.thumb}" alt="${game.title}" class="codream-thumb">
        <div class ="game-info">
            <a href="${game.url}"><h2>${game.title}</h2></a>
            <p>${game.description}</p>
        </div>
      `;
      container.appendChild(card);
    });
});

const games =
[
    {
        id: "futudroid",
        title: "FutuDroid",
        thumb: "../image/futudroid-thumb.png",
        description: "Pixel Art Science-Fiction 2D Platformer",
        url: "../pages/codream/futudroid.html"
    },
    {
        id: "v-form",
        title: "V Form",
        thumb: "../image/v-form.png",
        description: "8bit Retro-Style 2D Platformer",
        url: "../pages/codream/v-form.html"
    },
]