let cours = [];
const modal = document.getElementById("modalInscription");
const formulaire = document.getElementById("formInscriptionPublic");
const listeCours = document.getElementById("listeCours");
const zoneEleves = document.getElementById("zoneEleves");
const telephone = document.getElementById("telephoneParent");
const nombreCours = document.getElementById("nombreCours");
const montantTotal = document.getElementById("montantTotal");
const erreur = document.getElementById("erreurInscription");

const tarifs = {
    "Mathématiques": 300,
    "Physique": 350,
    "Français": 250,
    "Anglais": 280,
    "SVT": 320
};

document.getElementById("ouvrirInscription").addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
});

document.getElementById("fermerInscription").addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
});

async function chargerCours() {
    try {
        const reponse = await fetch("./src/data/data.json");
        const donnees = await reponse.json();
        cours = donnees.cours;

        listeCours.innerHTML = cours.map(c => `
            <label class="block rounded-xl border p-3">
                <input type="checkbox" class="selectionCours" value="${c.id}">
                ${c.nom} - ${c.niveau} - ${tarifs[c.nom] || 0} MAD
            </label>
        `).join("");

    } catch (error) {
        erreur.textContent = "Erreur de chargement des cours.";
    }
}

function obtenirCoursSelectionnes() {
    return [...document.querySelectorAll(".selectionCours:checked")]
        .map(input => cours.find(c => c.id === Number(input.value)));
}

function afficherChampsEleves() {
    const selectionCours = obtenirCoursSelectionnes();
    const niveaux = [...new Set(selectionCours.map(c => c.niveau))];

    zoneEleves.innerHTML = niveaux.map((niveau, index) => `
        <div>
            <label>Nom de l'élève (${niveau})</label>
            <input type="text" class="nomEleve" data-niveau="${niveau}"
                placeholder="Nom complet de l'enfant ${index + 1}" required>
        </div>
    `).join("");

    nombreCours.textContent = selectionCours.length;
    montantTotal.textContent = selectionCours.reduce(
        (total, c) => total + (tarifs[c.nom] || 0), 0
    ) + " MAD";
}

listeCours.addEventListener("change", afficherChampsEleves);

formulaire.addEventListener("submit", (e) => {
    e.preventDefault();
    erreur.textContent = "";

    const selectionCours = obtenirCoursSelectionnes();

    if (!selectionCours.length) {
        erreur.textContent = "Sélectionnez au moins un cours.";
        return;
    }

    if (!/^0\d{9}$/.test(telephone.value.trim())) {
        erreur.textContent = "Téléphone invalide.";
        return;
    }

    const eleves = {};

    for (const champ of document.querySelectorAll(".nomEleve")) {
        const nom = champ.value.trim();

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(nom)) {
            erreur.textContent = "Vérifiez le nom de chaque élève.";
            return;
        }

        eleves[champ.dataset.niveau] = nom;
    }

    const inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];

    selectionCours.forEach((c, index) => {
        inscriptions.push({
            id: Date.now() + index,
            eleve: eleves[c.niveau],
            niveau: c.niveau,
            cours: c.nom,
            telephone: telephone.value.trim(),
            statut: "En attente",
            date: new Date().toISOString().slice(0, 10),
            montant: tarifs[c.nom] || 0
        });
    });

    localStorage.setItem("inscriptions", JSON.stringify(inscriptions));

    alert("Inscription enregistrée avec succès !");

    formulaire.reset();
    zoneEleves.innerHTML = "";
    nombreCours.textContent = "0";
    montantTotal.textContent = "0 MAD";
    modal.classList.add("hidden");
    modal.classList.remove("flex");
});

chargerCours();
