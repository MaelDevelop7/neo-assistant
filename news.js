// news.js
let newsText = "Chargement des actualités...";

async function fetchNews() {
    try {
        const url = "https://api.rss2json.com/v1/api.json?rss_url=https://www.lemonde.fr/rss/une.xml";
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            newsText = data.items.slice(0, 3).map(a => a.title).join(". ");
        } else {
            newsText = "Actualités indisponibles";
        }
    } catch (err) {
        console.error("Impossible de récupérer les news :", err);
        newsText = "Actualités indisponibles";
    }
}

export default {
    init: async function() {
        console.log("Module news initialisé");
        await fetchNews();
    },
    getNewsText: function() {
        return newsText;
    }
}
