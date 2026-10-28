const STORAGE_KEY = "inscriptions";

const coursListe = [
    { nom: "Math - 2 Bac", capacite: 15 },
    { nom: "Physique - 2 Bac", capacite: 15 },
    { nom: "SVT - 1 Bac", capacite: 15 },
    { nom: "Français - Tronc Commun", capacite: 15 },
    { nom: "Anglais - 3eme année collège", capacite: 15 }
];

function chargerInscriptions() {
    try {
        const donnees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(donnees) ? donnees : [];
    } catch (error) {
        console.error("Erreur de lecture des inscriptions :", error);
        return [];
    }
}

function afficherPourcentage(nombre, total) {
    return total > 0 ? (nombre / total) * 100 : 0;
}

function actualiserDashboard() {
    const inscriptions = chargerInscriptions();

    const total = inscriptions.length;

    const attente = inscriptions.filter(
        inscription => inscription.status === "En attente"
    ).length;

    const validee = inscriptions.filter(
        inscription => inscription.status === "Validée"
    ).length;

    const payee = inscriptions.filter(
        inscription => inscription.status === "Payée"
    ).length;

    const totalInscriptions = document.querySelector("#totalInscriptions");
    const totalRecettes = document.querySelector("#totalRecettes");

    if (totalInscriptions) {
        totalInscriptions.textContent = total;
    }

    if (totalRecettes) {
        totalRecettes.textContent = "0MAD";
    }

    const statistiques = [{
            compteur: "#attenteCount",
            barre: "#attenteBar",
            nombre: attente
        },
        {
            compteur: "#valideeCount",
            barre: "#valideeBar",
            nombre: validee
        },
        {
            compteur: "#payeeCount",
            barre: "#payeeBar",
            nombre: payee
        }
    ];

    statistiques.forEach(statistique => {
        const compteur = document.querySelector(statistique.compteur);
        const barre = document.querySelector(statistique.barre);

        if (compteur) {
            compteur.textContent = `${statistique.nombre}/${total}`;
        }

        if (barre) {
            barre.style.width =
                `${afficherPourcentage(statistique.nombre, total)}%`;
        }
    });

    const capaciteTotale = coursListe.reduce(
        (somme, cours) => somme + cours.capacite,
        0
    );

    const capaciteElement = document.querySelector("#capaciteTotale");

    if (capaciteElement) {
        capaciteElement.textContent = capaciteTotale;
    }

    const coursContainer = document.querySelector("#coursContainer");

    if (coursContainer) {
        coursContainer.innerHTML = coursListe.map(cours => {
            const nombre = inscriptions.filter(
                inscription => inscription.course === cours.nom
            ).length;

            const pourcentage = Math.min(
                afficherPourcentage(nombre, cours.capacite),
                100
            );

            return `
                <div class="mb-4">
                    <div class="mb-1 flex justify-between gap-2 text-sm text-[#263D50]">
                        <span>${cours.nom}</span>
                        <span>${nombre}/${cours.capacite}</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-[#9FB6CC]">
                        <div
                            class="h-full rounded-full bg-[#1D5885]"
                            style="width: ${pourcentage}%">
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }
}

const roleConnecte = sessionStorage.getItem("roleConnecte");
const adminConnecte = sessionStorage.getItem("adminConnecte");

if (roleConnecte !== "admin" || adminConnecte !== "oui") {
    window.location.replace("index.html");
} else {
    actualiserDashboard();
    window.addEventListener("storage", actualiserDashboard);
    window.addEventListener("pageshow", actualiserDashboard);
}
const logoutButton = document.querySelector("#logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        sessionStorage.removeItem("roleConnecte");
        sessionStorage.removeItem("adminConnecte");
        sessionStorage.removeItem("secretaireConnecte");

        window.location.href = "index.html";
    });
}