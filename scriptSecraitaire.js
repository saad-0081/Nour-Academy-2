
const inscriptionsDemo = [
    {
        id: 1,
        nom: "Youssef Amrani",
        cours: "Mathématiques",
        centre: "Nador Centre",
        date: "2026-10-28",
        statut: "Validé",
        montant: 1800
    },
    {
        id: 2,
        nom: "Salma Idrissi",
        cours: "Physique",
        centre: "Hay Al Matar",
        date: "2026-10-27",
        statut: "En attente",
        montant: 1500
    },
    {
        id: 3,
        nom: "Omar Bennis",
        cours: "Français",
        centre: "Selouane",
        date: "2026-10-26",
        statut: "Incomplet",
        montant: 0
    },
    {
        id: 4,
        nom: "Sara El Fassi",
        cours: "Mathématiques",
        centre: "Nador Centre",
        date: "2026-10-25",
        statut: "Validé",
        montant: 1800
    },
    {
        id: 5,
        nom: "Adam Chraibi",
        cours: "Physique",
        centre: "Hay Al Matar",
        date: "2026-10-24",
        statut: "En attente",
        montant: 1500
    },
    {
        id: 6,
        nom: "Lina Ait Ali",
        cours: "Anglais",
        centre: "Selouane",
        date: "2026-10-23",
        statut: "Validé",
        montant: 1200
    }
];

let inscriptions;

try {
    const donneesSauvegardees = localStorage.getItem("nourInscriptions");
    inscriptions = donneesSauvegardees === null
        ? inscriptionsDemo
        : JSON.parse(donneesSauvegardees);

    if (!Array.isArray(inscriptions)) {
        inscriptions = inscriptionsDemo;
    }
} catch {
    inscriptions = inscriptionsDemo;
}

const cours = [
    { nom: "Mathématiques", capacite: 40 },
    { nom: "Physique", capacite: 35 },
    { nom: "Français", capacite: 30 },
    { nom: "Anglais", capacite: 25 }
];

function sauvegarder() {
    try {
        localStorage.setItem(
            "nourInscriptions",
            JSON.stringify(inscriptions)
        );
        return true;
    } catch {
        afficherMessage("Impossible de sauvegarder les données.", false);
        return false;
    }
}

function afficherMessage(message, succes = true) {
    const zone = document.getElementById("messageForm");

    zone.textContent = message;
    zone.className = succes
        ? "mt-3 text-sm font-semibold text-green-600"
        : "mt-3 text-sm font-semibold text-red-600";
}

function afficherStatistiques() {
    const total = inscriptions.length;

    const valides = inscriptions.filter(
        inscription => inscription.statut === "Validé"
    ).length;

    const attente = inscriptions.filter(
        inscription => inscription.statut === "En attente"
    ).length;

    const revenus = inscriptions.reduce(
        (somme, inscription) => somme + Number(inscription.montant || 0),
        0
    );

    document.getElementById("totalInscriptions").textContent = total;
    document.getElementById("dossiersValides").textContent = valides;
    document.getElementById("enAttente").textContent = attente;

    document.getElementById("revenus").textContent =
        revenus.toLocaleString("fr-FR") + " MAD";
}

function afficherCours() {
    const conteneur = document.getElementById("coursProgression");
    conteneur.innerHTML = "";

    cours.forEach(c => {
        const inscrits = inscriptions.filter(
            inscription =>
                inscription.cours === c.nom &&
                inscription.statut !== "Incomplet"
        ).length;

        const pourcentage = Math.min(
            100,
            Math.round(inscrits / c.capacite * 100)
        );

        const bloc = document.createElement("div");

        const ligneTitre = document.createElement("div");
        ligneTitre.className = "mb-2 flex items-center justify-between gap-3";

        const nom = document.createElement("span");
        nom.className = "text-sm font-semibold text-slate-700";
        nom.textContent = c.nom;

        const nombre = document.createElement("span");
        nombre.className = "text-sm text-slate-500";
        nombre.textContent = `${inscrits}/${c.capacite} places`;

        ligneTitre.append(nom, nombre);

        const barre = document.createElement("div");
        barre.className = "h-3 overflow-hidden rounded-full bg-slate-100";

        const progression = document.createElement("div");
        progression.className =
            `h-full rounded-full ${pourcentage >= 90 ? "bg-primary" : "bg-secondary"}`;
        progression.style.width = `${pourcentage}%`;

        barre.appendChild(progression);

        const texte = document.createElement("p");
        texte.className = "mt-1 text-right text-xs text-slate-500";
        texte.textContent = `${pourcentage}% rempli`;

        bloc.append(ligneTitre, barre, texte);
        conteneur.appendChild(bloc);
    });
}

function afficherInscriptions() {
    const tableau = document.getElementById("tableInscriptions");
    tableau.innerHTML = "";

    const recentes = [...inscriptions].sort(
        (a, b) => b.date.localeCompare(a.date)
    );

    document.getElementById("nombreTableau").textContent =
        `${recentes.length} inscription${recentes.length > 1 ? "s" : ""}`;

    if (recentes.length === 0) {
        const ligne = document.createElement("tr");
        const cellule = document.createElement("td");

        cellule.colSpan = 7;
        cellule.className = "px-6 py-10 text-center text-slate-500";
        cellule.textContent = "Aucune inscription enregistrée.";

        ligne.appendChild(cellule);
        tableau.appendChild(ligne);
        return;
    }

    recentes.forEach(inscription => {
        const ligne = document.createElement("tr");
        ligne.className = "transition hover:bg-slate-50";

        const valeurs = [
            inscription.nom,
            inscription.cours,
            inscription.centre,
            new Date(inscription.date + "T12:00:00").toLocaleDateString("fr-FR")
        ];

        valeurs.forEach(valeur => {
            const cellule = document.createElement("td");
            cellule.className = "whitespace-nowrap px-6 py-4 text-slate-600";
            cellule.textContent = valeur;
            ligne.appendChild(cellule);
        });

        const celluleStatut = document.createElement("td");
        celluleStatut.className = "whitespace-nowrap px-6 py-4";

        const badge = document.createElement("span");

        let couleur = "bg-green-100 text-green-700";

        if (inscription.statut === "En attente") {
            couleur = "bg-orange-100 text-orange-700";
        } else if (inscription.statut === "Incomplet") {
            couleur = "bg-red-100 text-red-700";
        }

        badge.className = `rounded-full px-3 py-1 text-xs font-semibold ${couleur}`;
        badge.textContent = inscription.statut;

        celluleStatut.appendChild(badge);
        ligne.appendChild(celluleStatut);

        const celluleMontant = document.createElement("td");
        celluleMontant.className = "whitespace-nowrap px-6 py-4 text-slate-600";
        celluleMontant.textContent =
            Number(inscription.montant || 0).toLocaleString("fr-FR") + " MAD";
        ligne.appendChild(celluleMontant);

        const celluleAction = document.createElement("td");
        celluleAction.className = "whitespace-nowrap px-6 py-4";

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.type = "button";
        boutonSupprimer.textContent = "Supprimer";
        boutonSupprimer.className =
            "rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200";

        boutonSupprimer.addEventListener("click", () => {
            const confirmation = confirm(
                `Voulez-vous supprimer l'inscription de ${inscription.nom} ?`
            );

            if (!confirmation) {
                return;
            }

            const anciennesInscriptions = inscriptions;

            inscriptions = inscriptions.filter(
                element => element.id !== inscription.id
            );

            if (sauvegarder()) {
                actualiserDashboard();
                afficherMessage("Inscription supprimée avec succès.");
            } else {
                inscriptions = anciennesInscriptions;
                actualiserDashboard();
            }
        });

        celluleAction.appendChild(boutonSupprimer);
        ligne.appendChild(celluleAction);

        tableau.appendChild(ligne);
    });
}

function actualiserDashboard() {
    afficherStatistiques();
    afficherCours();
    afficherInscriptions();
}

document.getElementById("formInscription").addEventListener("submit", event => {
    event.preventDefault();

    const formulaire = event.currentTarget;

    const nouvelleInscription = {
        id: Date.now(),
        nom: formulaire.elements.nom.value.trim(),
        cours: formulaire.elements.cours.value,
        centre: formulaire.elements.centre.value,
        date: formulaire.elements.date.value,
        statut: formulaire.elements.statut.value,
        montant: Number(formulaire.elements.montant.value)
    };

    if (
        !nouvelleInscription.nom ||
        !nouvelleInscription.cours ||
        !nouvelleInscription.centre ||
        !nouvelleInscription.date ||
        !Number.isFinite(nouvelleInscription.montant) ||
        nouvelleInscription.montant < 0
    ) {
        afficherMessage("Veuillez vérifier les informations saisies.", false);
        return;
    }

    const anciennesInscriptions = inscriptions;
    inscriptions = [...inscriptions, nouvelleInscription];

    if (!sauvegarder()) {
        inscriptions = anciennesInscriptions;
        return;
    }

    actualiserDashboard();
    formulaire.reset();

    afficherMessage("Inscription ajoutée avec succès.");
});

actualiserDashboard();
