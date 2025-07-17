document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('log-list');
    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "log-card";
        card.innerHTML= `
        <a href="${article.url}"><h3>${article.title}</h3></a>
        <p>${article.description}</p>
        `;
        container.appendChild(card);
    });
});

const articles = [
    //{ id: ".html", title: '', description: '' },
    { url: "../pages/logs/codlivion-intro.html", title: 'How I Got Into Coding', description: 'A small article on how I started as a self-learning programmer.' },
    { url: "../pages/logs/codream-intro.html", title: 'Introduction', description: 'CoDream Studio.' }
];