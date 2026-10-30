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

chargerDonnees().catch(function() {
    alert("Erreur de chargement. Vérifie le chemin de data.json et utilise Live Server.");
});