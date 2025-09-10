import weather from './weather.js';
import news from './news.js';

const synth = window.speechSynthesis;
let recognition;

const talkButton = document.getElementById("talk");
const statusText = document.getElementById("status");
talkButton.disabled = true;

document.addEventListener('DOMContentLoaded', async () => {
    await weather.init();
    await news.init();
    talkButton.disabled = false;
    statusText.textContent = "Neo prêt à parler !";

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge.");
        statusText.textContent = "Reconnaissance vocale indisponible.";
        talkButton.disabled = true;
        return;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.addEventListener("result", handleResult);
    recognition.addEventListener("end", () => {
        statusText.textContent = "Neo a fini d'écouter.";
        // relancer automatiquement l'écoute
        talkButton.disabled = false;
    });
});

// Démarrer reconnaissance vocale
talkButton.addEventListener("click", () => {
    if (recognition) {
        recognition.start();
        statusText.textContent = "Neo écoute...";
        talkButton.disabled = true;
    }
});

// Fonction pour gérer le résultat
function handleResult(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Transcript reconnu :", transcript);

    let responseText = "Je n'ai pas compris.";

    if (transcript.includes("météo")) {
        responseText = weather.getWeatherText();
    } else if (transcript.includes("actualités") || transcript.includes("news")) {
        responseText = news.getNewsText();
    } else if (transcript.includes("bonjour")) {
        responseText = "Bonjour ! Comment ça va ?";
    }

    console.log("Réponse Neo :", responseText);
    speak(responseText);
}

// Fonction pour faire parler Neo
function speak(text) {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = "fr-FR";
    utterThis.onend = () => {
        // après avoir parlé, Neo peut écouter à nouveau
        talkButton.disabled = false;
        statusText.textContent = "Neo prêt à écouter une nouvelle commande.";
    };
    synth.speak(utterThis);
}
