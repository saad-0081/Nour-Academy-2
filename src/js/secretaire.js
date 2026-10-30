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

function obtenirInscriptionsFiltrees() {
    let resultat = [...inscriptions];

    const recherche = document.getElementById("recherche").value
        .trim().toLowerCase();

    const statut = document.getElementById("filtreStatut").value;
    const tri = document.getElementById("tri").value;

    sessionStorage.setItem("recherche", recherche);
    sessionStorage.setItem("statut", statut);
    sessionStorage.setItem("tri", tri);

    resultat = resultat.filter(function(i) {
        return i.eleve.toLowerCase().includes(recherche) ||
               i.telephone.includes(recherche);
    });

    if (statut !== "") {
        resultat = resultat.filter(function(i) {
            return i.statut === statut;
        });
    }

    if (tri === "dateAsc") {
        resultat.sort(function(a, b) {
            return a.date.localeCompare(b.date);
        });
    } else if (tri === "dateDesc") {
        resultat.sort(function(a, b) {
            return b.date.localeCompare(a.date);
        });
    } else if (tri === "nomAsc") {
        resultat.sort(function(a, b) {
            return a.eleve.localeCompare(b.eleve);
        });
    } else if (tri === "nomDesc") {
        resultat.sort(function(a, b) {
            return b.eleve.localeCompare(a.eleve);
        });
    }

    return resultat;
}

function afficherInscriptions() {
    const resultat = obtenirInscriptionsFiltrees();
    const totalPages = Math.max(1, Math.ceil(resultat.length / lignesParPage));

    if (pageActuelle > totalPages) {
        pageActuelle = totalPages;
    }

    const debut = (pageActuelle - 1) * lignesParPage;
    const liste = resultat.slice(debut, debut + lignesParPage);

    table.innerHTML = "";

    liste.forEach(function(i) {
        table.innerHTML += `
            <tr class="border-b border-gray-100">
                <td class="p-4">${i.eleve}</td>
                <td class="p-4">${i.niveau}</td>
                <td class="p-4">${i.cours}</td>
                <td class="p-4">${i.telephone}</td>
                <td class="p-4">${afficherStatut(i.statut)}</td>
                <td class="p-4">${i.date}</td>
                <td class="p-4">
                    <button onclick="modifierInscription(${i.id})"
                        class="text-bleu mr-2">Modifier</button>
                    <button onclick="supprimerInscription(${i.id})"
                        class="text-red-600">Supprimer</button>
                </td>
            </tr>`;
    });

    if (liste.length === 0) {
        table.innerHTML = `
            <tr><td colspan="7" class="p-6 text-center">
                Aucune inscription trouvée.
            </td></tr>`;
    }

    document.getElementById("nombreResultats").textContent =
        resultat.length + " inscription(s) trouvée(s)";

    document.getElementById("pageInfo").textContent =
        "Page " + pageActuelle + " / " + totalPages;

    document.getElementById("precedent").disabled = pageActuelle === 1;
    document.getElementById("suivant").disabled = pageActuelle === totalPages;
}

function changerPage(direction) {
    pageActuelle += direction;
    afficherInscriptions();
}

function ouvrirFormulaire() {
    formulaire.reset();
    document.getElementById("idInscription").value = "";
    document.getElementById("titreFormulaire").textContent = "Nouvelle inscription";
    document.getElementById("erreur").textContent = "";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function fermerFormulaire() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function modifierInscription(id) {
    const i = inscriptions.find(function(inscription) {
        return inscription.id === id;
    });

    if (!i) return;

    document.getElementById("idInscription").value = i.id;
    document.getElementById("eleve").value = i.eleve;
    document.getElementById("niveau").value = i.niveau;
    document.getElementById("cours").value = i.cours;
    document.getElementById("telephone").value = i.telephone;
    document.getElementById("statut").value = i.statut;
    document.getElementById("montant").value = i.montant;

    document.getElementById("titreFormulaire").textContent =
        "Modifier l'inscription";

    document.getElementById("erreur").textContent = "";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

formulaire.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("idInscription").value;
    const eleve = document.getElementById("eleve").value.trim();
    const niveau = document.getElementById("niveau").value;
    const nomCours = document.getElementById("cours").value;
    const telephone = document.getElementById("telephone").value.trim();
    const statut = document.getElementById("statut").value;
    const montant = Number(document.getElementById("montant").value);
    const erreur = document.getElementById("erreur");

    erreur.textContent = "";

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(eleve)) {
        erreur.textContent = "Vérifie le nom complet de l'élève.";
        return;
    }

    if (!/^0\d{9}$/.test(telephone)) {
        erreur.textContent = "Le téléphone doit contenir 10 chiffres et commencer par 0.";
        return;
    }

    if (montant < 0 || document.getElementById("montant").value === "") {
        erreur.textContent = "Le montant doit être positif ou égal à zéro.";
        return;
    }

    const coursChoisi = cours.find(function(c) {
        return c.nom === nomCours;
    });

    if (!coursChoisi) {
        erreur.textContent = "Sélectionne un cours valide.";
        return;
    }

    const doublon = inscriptions.some(function(i) {
        return i.id !== Number(id) &&
            i.eleve.toLowerCase() === eleve.toLowerCase() &&
            i.cours === nomCours;
    });

    if (doublon) {
        erreur.textContent = "Cet élève est déjà inscrit à ce cours.";
        return;
    }

    const nombreInscrits = inscriptions.filter(function(i) {
        return i.cours === nomCours && i.id !== Number(id);
    }).length;

    if (nombreInscrits >= coursChoisi.capacite) {
        erreur.textContent = "Ce cours est complet.";
        return;
    }

    const nouvelleInscription = {
        id: id ? Number(id) : Date.now(),
        eleve: eleve,
        niveau: niveau,
        cours: nomCours,
        telephone: telephone,
        statut: statut,
        date: new Date().toISOString().slice(0, 10),
        montant: montant
    };

    if (id) {
        const index = inscriptions.findIndex(function(i) {
            return i.id === Number(id);
        });

        nouvelleInscription.date = inscriptions[index].date;
        inscriptions[index] = nouvelleInscription;
    } else {
        inscriptions.push(nouvelleInscription);
    }

    sauvegarder();
    pageActuelle = 1;
    afficherInscriptions();
    afficherStatistiques();
    fermerFormulaire();
});

document.getElementById("recherche").addEventListener("input", function() {
    pageActuelle = 1;
    afficherInscriptions();
});

document.getElementById("filtreStatut").addEventListener("change", function() {
    pageActuelle = 1;
    afficherInscriptions();
});

document.getElementById("tri").addEventListener("change", function() {
    pageActuelle = 1;
    afficherInscriptions();
});

chargerDonnees().catch(function() {
    alert("Erreur de chargement. Vérifie le chemin de data.json et utilise Live Server.");
});