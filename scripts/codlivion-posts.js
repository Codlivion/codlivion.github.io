document.addEventListener('DOMContentLoaded', function () {
    const articleList = document.getElementById('article-list');
    const articles = [
        //{ id: ".html", title: '', description: '' },
        { id: "codlivion-intro", title: 'How I Got Into Coding', description: 'A small article on how I started as a self-learning programmer.' },
        { id: "codream-intro", title: 'Introduction', description: 'CoDream Studio.' }
    ];

    function createListItem(article) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `../pages/codlivion/${article.id}.html`;
        link.textContent = `${article.title} - ${article.description}`;
        listItem.appendChild(link);
        return listItem;
    };

    function appendArticles() {
        articles.forEach(function(article) {
            const listItem = createListItem(article);
            articleList.appendChild(listItem);
        });
    };

    appendArticles();
});