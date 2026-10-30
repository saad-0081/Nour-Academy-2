let inscriptions = [];
let cours = [];
let pageActuelle = 1;

const lignesParPage = 10;
const table = document.getElementById("tableInscriptions");
const formulaire = document.getElementById("formInscription");
const modal = document.getElementById("modal");

async function chargerDonnees() {
    const reponse = await fetch("./src/data/data.json");
    const donnees = await reponse.json();

    cours = donnees.cours;

    const sauvegarde = localStorage.getItem("inscriptions");

    if (sauvegarde) {
        inscriptions = JSON.parse(sauvegarde);
    } else {
        inscriptions = donnees.inscriptions;
        sauvegarder();
    }

    document.getElementById("recherche").value =
        sessionStorage.getItem("recherche") || "";

    document.getElementById("filtreStatut").value =
        sessionStorage.getItem("statut") || "";

    document.getElementById("tri").value =
        sessionStorage.getItem("tri") || "dateDesc";

    remplirCours();
    afficherStatistiques();
    afficherInscriptions();
    afficherPageDepuisHash();
}

function sauvegarder() {
    localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
}

function remplirCours() {
    const select = document.getElementById("cours");
    select.innerHTML = "";

    cours.forEach(function(c) {
        select.innerHTML += `<option value="${c.nom}">${c.nom}</option>`;
    });
}

function afficherPage(page) {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("inscriptions").classList.add("hidden");
    document.getElementById(page).classList.remove("hidden");

    document.getElementById("titrePage").textContent =
        page === "dashboard" ? "Tableau de bord" : "Gestion des inscriptions";

    document.getElementById("descriptionPage").textContent =
        page === "dashboard"
            ? "Vue générale de l'activité de l'académie."
            : "Recherche, modification et suivi des dossiers.";

    document.querySelectorAll(".menu-btn").forEach(function(bouton) {
        bouton.classList.remove("bg-white/15");
    });

    document.getElementById("menu-" + page).classList.add("bg-white/15");

    if (location.hash !== "#" + page) {
        location.hash = page;
    }
}

function afficherPageDepuisHash() {
    const page = location.hash.substring(1);

    if (page === "dashboard" || page === "inscriptions") {
        afficherPage(page);
    } else {
        afficherPage("dashboard");
    }
}

window.addEventListener("hashchange", afficherPageDepuisHash);

chargerDonnees().catch(function() {
    alert("Erreur de chargement. Vérifie le chemin de data.json et utilise Live Server.");
});