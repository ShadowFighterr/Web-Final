let articles = [];
let currentTheme = 'light';


fetch('Articles.json')
    .then(response => response.json())
    .then(data => {
        articles = data.articles;
        displayArticles(articles);
        displayMostPopularArticle();
    });

function displayArticles(articlesArray) {
    const container = document.getElementById('articles-container');
    container.innerHTML = ''; 

    articlesArray.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card mb-3';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = article.title;

        const info = document.createElement('p');
        info.className = 'card-text';
        info.innerHTML = `<small class="text-muted">${article.date} | ${article.category} | ${article.views} views</small>`;

        const readingTime = document.createElement('p');
        readingTime.className = 'card-text';
        const estimatedTime = Math.ceil(article.wordCount / 200);
        readingTime.innerHTML = `<small class="text-muted">Estimated reading time: ${estimatedTime} min</small>`;

        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'btn btn-primary';
        readMoreBtn.textContent = 'Read More';
        readMoreBtn.addEventListener('click', () => {
            openArticleModal(article.id);
        });

        cardBody.appendChild(title);
        cardBody.appendChild(info);
        cardBody.appendChild(readingTime);
        cardBody.appendChild(readMoreBtn);
        card.appendChild(cardBody);
        container.appendChild(card);
    });
}


function openArticleModal(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (article) {
        document.getElementById('articleModalLabel').textContent = article.title;
        document.getElementById('articleModalContent').innerHTML = `<p>${article.content}</p>`;
        const estimatedTime = Math.ceil(article.wordCount / 200);
        document.getElementById('articleModalReadingTime').textContent = `Estimated reading time: ${estimatedTime} min`;

        article.views += 1;

        displayMostPopularArticle();

        displayArticles(articles);

        const articleModal = new bootstrap.Modal(document.getElementById('articleModal'));
        articleModal.show();
    }
}


function displayMostPopularArticle() {
    const mostPopular = articles.reduce(
        (max, article) => (article.views > max.views ? article : max),
        articles[0]
    );

    const containerSidebar = document.getElementById('most-popular-article');
    containerSidebar.innerHTML = `
        <h5>${mostPopular.title}</h5>
        <p><small class="text-muted">${mostPopular.date} | ${mostPopular.category} | ${mostPopular.views} views</small></p>
        <button class="btn btn-primary" onclick="openArticleModal(${mostPopular.id})">Read More</button>
    `;

    const containerMobile = document.getElementById('most-popular-mobile');
    containerMobile.innerHTML = `
        <h6>${mostPopular.title}</h6>
        <p><small class="text-muted">${mostPopular.date} | ${mostPopular.views} views</small></p>
        <button class="btn btn-primary btn-sm" onclick="openArticleModal(${mostPopular.id})">Read More</button>
    `;
}


document.getElementById('sortOptions').addEventListener('change', function () {
    const sortBy = this.value;
    if (sortBy === 'date') {
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'views') {
        articles.sort((a, b) => b.views - a.views);
    }
    displayArticles(articles);
});

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

function toggleTheme() {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
});
