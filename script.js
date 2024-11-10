document.addEventListener("DOMContentLoaded", function() {
    let theme = localStorage.getItem("theme") || "light";
    document.body.classList.add(`${theme}-mode`);

    document.getElementById("theme-toggle").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        document.body.classList.toggle("dark-mode");
        theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("theme", theme);

        const htmlElements = document.querySelectorAll("header, main, footer, .card, .modal-content");
        htmlElements.forEach(element => {
            element.classList.toggle("dark-mode");
            element.classList.toggle("light-mode");
        });
    });

    fetch("Articles.json")
        .then(response => response.json())
        .then(data => {
            renderArticles(data.articles);
            displayMostPopular(data.articles);
        });

    document.getElementById("sort-options").addEventListener("change", function() {
        const sortBy = this.value;
        fetch("Articles.json")
            .then(response => response.json())
            .then(data => {
                const sortedArticles = data.articles.sort((a, b) => sortBy === "views" ? b.views - a.views : new Date(b.date) - new Date(a.date));
                renderArticles(sortedArticles);
            });
    });
});

function renderArticles(articles) {
    const articlesContainer = document.getElementById("articles");
    articlesContainer.innerHTML = "";

    articles.forEach(article => {
        const readingTime = Math.ceil(article.wordCount / 200);
        const articleHTML = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.content.substring(0, 100)}...</p>
                        <p class="card-text">Category: ${article.category} | Date: ${article.date} | Views: ${article.views}</p>
                        <p class="card-text">Estimated Reading Time: ${readingTime} min</p>
                        <button class="btn btn-primary" data-toggle="modal" data-target="#articleModal" onclick="viewArticle('${article.id}')">Read More</button>
                    </div>
                </div>
            </div>
        `;
        articlesContainer.innerHTML += articleHTML;
    });
}
function displayMostPopular(articles) {
    const mostPopular = articles.reduce((max, article) => article.views > max.views ? article : max);
    const popularHTML = `
      <h5>${mostPopular.title}</h5>
      <p>${mostPopular.content.substring(0, 100)}...</p>
      <p>Views: ${mostPopular.views}</p>
      <button class="btn btn-primary" data-toggle="modal" data-target="#articleModal" onclick="viewArticle('${mostPopular.id}')">Read</button>
    `;
    document.getElementById("most-popular").innerHTML = popularHTML;
  }

function viewArticle(articleId) {
    const numericArticleId = Number(articleId);

    fetch("Articles.json")
        .then(response => response.json())
        .then(data => {
            const article = data.articles.find(a => a.id === numericArticleId);
            console.log("Fetched article:", article); 

            if (article) {
                document.getElementById("articleModalLabel").textContent = article.title;
                document.getElementById("articleContent").textContent = article.content;
                document.getElementById("articleDetails").textContent = `Category: ${article.category} | Date: ${article.date} | Views: ${article.views}`;

                $('#articleModal').modal('show');
            } else {
                console.error("Article not found with ID:", numericArticleId);
            }
        })
        .catch(error => console.error("Error fetching articles:", error));
}

document.querySelector('[data-dismiss="modal"]').addEventListener('click', function() {
    $('#articleModal').modal('hide');  
});
