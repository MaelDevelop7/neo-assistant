// weather.js
let weatherText = "Chargement météo...";

async function fetchWeather() {
    try {
        const latitude = 40.4165; // Madrid
        const longitude = -3.7026;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        // Récupérer la température actuelle (première donnée horaire)
        const temp = data.hourly.temperature_2m[0];
        const weatherCode = data.hourly.weathercode[0];

        // Pour Neo, on peut transformer le code météo en texte simple
        const weatherDescription = getWeatherDescription(weatherCode);
        weatherText = `${weatherDescription}, température ${temp}°C`;
    } catch (err) {
        console.error("Impossible de récupérer la météo :", err);
        weatherText = "Météo indisponible";
    }
}

// Fonction simple pour traduire le code météo Open-Meteo en texte
function getWeatherDescription(code) {
    const map = {
        0: "Ciel dégagé",
        1: "Principalement clair",
        2: "Partiellement nuageux",
        3: "Couvert",
        45: "Brouillard",
        48: "Brouillard givrant",
        51: "Bruine légère",
        53: "Bruine modérée",
        55: "Bruine dense",
        61: "Pluie légère",
        63: "Pluie modérée",
        65: "Pluie forte",
        71: "Neige légère",
        73: "Neige modérée",
        75: "Neige forte",
        80: "Averses légères",
        81: "Averses modérées",
        82: "Averses fortes",
        95: "Orage",
        96: "Orage avec grêle légère",
        99: "Orage avec grêle forte"
    };
    return map[code] || "Météo inconnue";
}

export default {
    init: async function() {
        console.log("Module météo initialisé");
        await fetchWeather();
    },
    getWeatherText: function() {
        return weatherText;
    }
}
