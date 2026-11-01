
let inscriptions = [];
let cours = [];

async function chargerDonnees() {
    try {
        const reponse = await fetch("/src/data/data.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger les données");
        }

        const donnees = await reponse.json();

        cours = donnees.cours;

    
        const sauvegarde = localStorage.getItem("inscriptions");

        if (sauvegarde !== null) {
            inscriptions = JSON.parse(sauvegarde);
        } else {
            inscriptions = donnees.inscriptions;
            sauvegarder();
        }

        afficherStatistiques();
        afficherCapacites();

    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}


function sauvegarder() {
    localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
}

function afficherStatistiques() {

    const total = inscriptions.length;

    const attente = inscriptions.filter(function(i) {
        return i.statut === "En attente";
    });

    const incomplets = inscriptions.filter(function(i) {
        return i.statut === "Incomplet";
    });

    const payees = inscriptions.filter(function(i) {
        return i.statut === "Payé";
    });

    document.getElementById("totalInscriptions").textContent = total;

    const revenus = payees.reduce(function(somme, i) {
        return somme + Number(i.montant || 0);
    }, 0);

    document.getElementById("totalRecettes").textContent =
        revenus.toLocaleString("fr-FR") + " MAD";

    const pourcentageAttente = total === 0 ? 0 : (attente.length / total) * 100;
    const pourcentageIncomplet = total === 0 ? 0 : (incomplets.length / total) * 100;
    const pourcentagePayee = total === 0 ? 0 : (payees.length / total) * 100;

    document.getElementById("attenteCount").textContent =
        attente.length + "/" + total;

    document.getElementById("valideeCount").textContent =
        incomplets.length + "/" + total;

    document.getElementById("payeeCount").textContent =
        payees.length + "/" + total;

    document.getElementById("attenteBar").style.width =
        pourcentageAttente + "%";

    document.getElementById("valideeBar").style.width =
        pourcentageIncomplet + "%";

    document.getElementById("payeeBar").style.width =
        pourcentagePayee + "%";
}

function afficherCapacites() {

    const zone = document.getElementById("coursContainer");

    zone.innerHTML = "";

    let capaciteTotale = 0;

    cours.forEach(function(c) {

        const nombre = inscriptions.filter(function(i) {
            return i.cours === c.nom;
        }).length;

        const places = Math.max(c.capacite - nombre, 0);

        const pourcentage = c.capacite === 0
            ? 0
            : Math.min((nombre / c.capacite) * 100, 100);

        capaciteTotale += Number(c.capacite);

        zone.innerHTML += `
            <div class="mb-4 rounded-2xl border border-[#9FB6CC] bg-white p-4">

                <div class="mb-3 flex items-center justify-between gap-3">

                    <div>
                        <p class="font-semibold text-[#1D5885]">
                            ${c.nom}
                        </p>

                        <p class="text-xs text-gray-500">
                            ${c.niveau}
                        </p>
                    </div>

                    <p class="text-sm font-semibold text-[#173E5B]">
                        ${nombre}/${c.capacite}
                    </p>

                </div>

                <div class="h-2.5 overflow-hidden rounded-full bg-[#D5E2EF]">

                    <div
                        class="h-full rounded-full bg-[#F79428]"
                        style="width: ${pourcentage}%">
                    </div>

                </div>

                <p class="mt-2 text-xs text-gray-500">
                    ${places} place(s) restante(s)
                </p>

            </div>
        `;
    });

    document.getElementById("capaciteTotale").textContent =
        capaciteTotale;
}

document.getElementById("logoutButton").addEventListener("click", function() {
    window.location.href = "/index.html";
});

window.addEventListener("storage", function(e) {

    if (e.key === "inscriptions") {

        inscriptions = JSON.parse(e.newValue || "[]");

        afficherStatistiques();
        afficherCapacites();
    }
});

chargerDonnees();
