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

function afficherStatistiques() {
    const total = inscriptions.length;
    const payes = inscriptions.filter(function(i) {
        return i.statut === "Payé";
    });
    const attente = inscriptions.filter(function(i) {
        return i.statut === "En attente";
    });
    const incomplets = inscriptions.filter(function(i) {
        return i.statut === "Incomplet";
    });

    document.getElementById("totalInscriptions").textContent = total;
    document.getElementById("totalPayes").textContent = payes.length;
    document.getElementById("totalAttente").textContent = attente.length;
    document.getElementById("totalIncomplets").textContent = incomplets.length;

    const pourcentage = total === 0 ? 0 : Math.round(payes.length / total * 100);

    document.getElementById("pourcentagePayes").textContent =
        pourcentage + " % des inscriptions";

    const revenus = payes.reduce(function(somme, i) {
        return somme + Number(i.montant);
    }, 0);

    const revenusAttente = attente.reduce(function(somme, i) {
        return somme + Number(i.montant);
    }, 0);

    document.getElementById("revenus").textContent = revenus + " MAD";
    document.getElementById("revenusAttente").textContent = revenusAttente + " MAD";

    document.getElementById("barrePayes").style.width =
        (total ? payes.length / total * 100 : 0) + "%";

    document.getElementById("barreAttente").style.width =
        (total ? attente.length / total * 100 : 0) + "%";

    document.getElementById("barreIncomplets").style.width =
        (total ? incomplets.length / total * 100 : 0) + "%";

    document.getElementById("nombrePayesBarre").textContent = payes.length;
    document.getElementById("nombreAttenteBarre").textContent = attente.length;
    document.getElementById("nombreIncompletsBarre").textContent = incomplets.length;

    afficherCapacites();
    afficherInscriptionsRecentes();
}

function afficherCapacites() {
    const zone = document.getElementById("capacites");
    zone.innerHTML = "";

    cours.forEach(function(c) {
        const nombre = inscriptions.filter(function(i) {
            return i.cours === c.nom;
        }).length;

        const places = Math.max(c.capacite - nombre, 0);
        const pourcentage = Math.min(nombre / c.capacite * 100, 100);

        zone.innerHTML += `
            <div class="border border-gray-100 rounded-xl p-4">
                <div class="flex justify-between mb-3">
                    <div>
                        <p class="font-semibold text-bleu">${c.nom}</p>
                        <p class="text-xs text-gray-500">${c.niveau}</p>
                    </div>
                    <p class="text-sm">${nombre}/${c.capacite}</p>
                </div>
                <div class="bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-orange h-full rounded-full"
                         style="width:${pourcentage}%"></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    ${places} place(s) restante(s)
                </p>
            </div>`;
    });
}

function afficherInscriptionsRecentes() {
    const zone = document.getElementById("inscriptionsRecentes");

    const recentes = [...inscriptions].sort(function(a, b) {
        return b.date.localeCompare(a.date);
    }).slice(0, 5);

    zone.innerHTML = "";

    recentes.forEach(function(i) {
        zone.innerHTML += `
            <tr class="border-t border-gray-100">
                <td class="p-4">${i.eleve}</td>
                <td class="p-4">${i.cours}</td>
                <td class="p-4">${i.date}</td>
                <td class="p-4">${afficherStatut(i.statut)}</td>
            </tr>`;
    });

    if (recentes.length === 0) {
        zone.innerHTML = `
            <tr><td colspan="4" class="p-4 text-center">
                Aucune inscription disponible.
            </td></tr>`;
    }
}

function afficherStatut(statut) {
    let couleur = "bg-orange/15 text-orange";

    if (statut === "Payé") {
        couleur = "bg-green-100 text-green-700";
    } else if (statut === "Incomplet") {
        couleur = "bg-red-100 text-red-700";
    }

    return `<span class="${couleur} px-3 py-1 rounded-full text-xs">${statut}</span>`;
}

chargerDonnees().catch(function() {
    alert("Erreur de chargement. Vérifie le chemin de data.json et utilise Live Server.");
});