const loginSection = document.querySelector("#loginSection");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const adminContent = document.querySelector("#adminContent");
const logoutButton = document.querySelector("#logoutButton");

const adminUsername = "admin";
const adminPassword = "Nour2026";

if (!loginSection || !loginForm || !loginError || !adminContent) {
    console.error("Erreur : éléments de connexion introuvables.");
} else {
    function afficherAdmin() {
        loginSection.classList.add("hidden");
        adminContent.classList.remove("hidden");
        afficherInscriptions();
    }

    function afficherConnexion() {
        loginSection.classList.remove("hidden");
        adminContent.classList.add("hidden");
    }

    if (sessionStorage.getItem("adminConnecte") === "oui") {
        afficherAdmin();
    } else {
        afficherConnexion();
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.querySelector("#username").value.trim();
        const password = document.querySelector("#password").value;

        if (username === adminUsername && password === adminPassword) {
            sessionStorage.setItem("adminConnecte", "oui");
            loginError.classList.add("hidden");
            loginForm.reset();
            afficherAdmin();
        } else {
            loginError.classList.remove("hidden");
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            sessionStorage.removeItem("adminConnecte");
            afficherConnexion();
        });
    }
}

const registrationTable = document.querySelector("#registrationTable");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const courseFilter = document.querySelector("#courseFilter");
const sortFilter = document.querySelector("#sortFilter");
const resultCount = document.querySelector("#resultCount");
const emptyMessage = document.querySelector("#emptyMessage");
const pageInfo = document.querySelector("#pageInfo");

const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");

const registrationModal = document.querySelector("#registrationModal");
const registrationForm = document.querySelector("#registrationForm");
const modalTitle = document.querySelector("#modalTitle");
const editId = document.querySelector("#editId");

const studentName = document.querySelector("#studentName");
const studentLevel = document.querySelector("#studentLevel");
const studentCourse = document.querySelector("#studentCourse");
const parentPhone = document.querySelector("#parentPhone");
const registrationStatus = document.querySelector("#registrationStatus");

const openModalButton = document.querySelector("#openModalButton");
const closeModalButton = document.querySelector("#closeModalButton");
const cancelButton = document.querySelector("#cancelButton");
const exportButton = document.querySelector("#exportButton");
const resetButton = document.querySelector("#resetButton");

const STORAGE_KEY = "inscriptions";
const INSCRIPTIONS_PAR_PAGE = 8;

let inscriptions = [];
let pageActuelle = 1;

function chargerInscriptions() {
    try {
        const donnees = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        inscriptions = Array.isArray(donnees) ? donnees : [];
    } catch (error) {
        console.error("Erreur de lecture des inscriptions :", error);
        inscriptions = [];
    }
}

function sauvegarderInscriptions() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inscriptions));
        return true;
    } catch (error) {
        console.error("Erreur de sauvegarde :", error);
        alert("Impossible de sauvegarder les données.");
        return false;
    }
}

function echapperHTML(valeur) {
    return String(valeur ? valeur : "").replace(/[&<>"']/g, function(caractere) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caractere];
    });
}

function formaterDate(date) {
    if (!date) {
        return "—";
    }

    const resultat = new Date(date);

    if (Number.isNaN(resultat.getTime())) {
        return "—";
    }

    return resultat.toLocaleDateString("fr-FR");
}

function obtenirInscriptionsFiltrees() {
    const recherche = searchInput.value.trim().toLowerCase();
    const statut = statusFilter.value;
    const cours = courseFilter.value;
    const tri = sortFilter.value;

    let resultat = inscriptions.filter(function(inscription) {
        const nom = String(inscription.name ? inscription.name : "").toLowerCase();
        const telephone = String(inscription.phone ? inscription.phone : "").toLowerCase();

        const correspondRecherche =
            nom.includes(recherche) || telephone.includes(recherche);

        const correspondStatut =
            statut === "" || inscription.status === statut;

        const correspondCours =
            cours === "" || inscription.course === cours;

        return correspondRecherche && correspondStatut && correspondCours;
    });

    resultat.sort(function(a, b) {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();

        return tri === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return resultat;
}

function afficherInscriptions() {
    if (!registrationTable) {
        return;
    }

    const resultat = obtenirInscriptionsFiltrees();
    const nombrePages = Math.ceil(resultat.length / INSCRIPTIONS_PAR_PAGE);

    if (nombrePages === 0) {
        pageActuelle = 1;
    } else if (pageActuelle > nombrePages) {
        pageActuelle = nombrePages;
    }

    const debut = (pageActuelle - 1) * INSCRIPTIONS_PAR_PAGE;
    const inscriptionsPage = resultat.slice(debut, debut + INSCRIPTIONS_PAR_PAGE);

    registrationTable.innerHTML = "";

    inscriptionsPage.forEach(function(inscription) {
        const ligne = document.createElement("tr");

        let couleurStatut = "bg-yellow-100 text-yellow-800";

        if (inscription.status === "Validée") {
            couleurStatut = "bg-blue-100 text-blue-800";
        } else if (inscription.status === "Payée") {
            couleurStatut = "bg-green-100 text-green-800";
        }

        ligne.innerHTML = `
            <td class="whitespace-nowrap px-4 py-3">${echapperHTML(inscription.id)}</td>
            <td class="whitespace-nowrap px-4 py-3 font-semibold">${echapperHTML(inscription.name)}</td>
            <td class="whitespace-nowrap px-4 py-3">${echapperHTML(inscription.level)}</td>
            <td class="whitespace-nowrap px-4 py-3">${echapperHTML(inscription.course)}</td>
            <td class="whitespace-nowrap px-4 py-3">${echapperHTML(inscription.phone)}</td>
            <td class="whitespace-nowrap px-4 py-3">
                <span class="rounded-full px-3 py-1 text-xs font-semibold ${couleurStatut}">
                    ${echapperHTML(inscription.status)}
                </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3">${formaterDate(inscription.date)}</td>
            <td class="whitespace-nowrap px-4 py-3">
                <button type="button" data-action="edit" data-id="${echapperHTML(inscription.id)}"
                    class="mr-2 rounded-lg bg-[#1D5885] px-3 py-2 text-white hover:bg-[#174B73]">
                    Modifier
                </button>
                <button type="button" data-action="delete" data-id="${echapperHTML(inscription.id)}"
                    class="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700">
                    Supprimer
                </button>
            </td>
        `;

        registrationTable.appendChild(ligne);
    });

    if (resultCount) {
        resultCount.textContent = `${resultat.length} inscription(s)`;
    }

    if (emptyMessage) {
        emptyMessage.classList.toggle("hidden", resultat.length !== 0);
    }

    if (pageInfo) {
        pageInfo.textContent = `Page ${nombrePages === 0 ? 0 : pageActuelle} / ${nombrePages}`;
    }

    if (previousButton) {
        previousButton.disabled = pageActuelle <= 1;
    }

    if (nextButton) {
        nextButton.disabled = nombrePages === 0 || pageActuelle >= nombrePages;
    }
}

function ouvrirModal() {
    registrationForm.reset();
    editId.value = "";
    modalTitle.textContent = "Nouvelle inscription";
    registrationModal.classList.remove("hidden");
    registrationModal.classList.add("flex");
}

function fermerModal() {
    registrationModal.classList.add("hidden");
    registrationModal.classList.remove("flex");
    registrationForm.reset();
    editId.value = "";
}

if (openModalButton) {
    openModalButton.addEventListener("click", ouvrirModal);
}

if (closeModalButton) {
    closeModalButton.addEventListener("click", fermerModal);
}

if (cancelButton) {
    cancelButton.addEventListener("click", fermerModal);
}

if (registrationForm) {
    registrationForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nom = studentName.value.trim();
        const niveau = studentLevel.value.trim();
        const cours = studentCourse.value;
        const telephone = parentPhone.value.trim();
        const statut = registrationStatus.value;

        if (!nom || !niveau || !cours || !telephone || !statut) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const idModification = editId.value;

        if (idModification) {
            const index = inscriptions.findIndex(function(inscription) {
                return String(inscription.id) === String(idModification);
            });

            if (index !== -1) {
                inscriptions[index] = {
                    ...inscriptions[index],
                    name: nom,
                    level: niveau,
                    course: cours,
                    phone: telephone,
                    status: statut
                };
            }
        } else {
            inscriptions.push({
                id: Date.now().toString(),
                name: nom,
                level: niveau,
                course: cours,
                phone: telephone,
                status: statut,
                date: new Date().toISOString()
            });
        }

        if (sauvegarderInscriptions()) {
            fermerModal();
            pageActuelle = 1;
            afficherInscriptions();
        }
    });
}

if (registrationTable) {
    registrationTable.addEventListener("click", function(event) {
        const bouton = event.target.closest("button[data-action]");

        if (!bouton) {
            return;
        }

        const id = bouton.dataset.id;
        const action = bouton.dataset.action;

        const inscription = inscriptions.find(function(element) {
            return String(element.id) === String(id);
        });

        if (!inscription) {
            return;
        }

        if (action === "edit") {
            editId.value = inscription.id;
            studentName.value = inscription.name || "";
            studentLevel.value = inscription.level || "";
            studentCourse.value = inscription.course || "";
            parentPhone.value = inscription.phone || "";
            registrationStatus.value = inscription.status || "En attente";

            modalTitle.textContent = "Modifier l'inscription";
            registrationModal.classList.remove("hidden");
            registrationModal.classList.add("flex");
        }

        if (action === "delete") {
            const confirmation = confirm(
                `Voulez-vous supprimer l'inscription de ${inscription.name} ?`
            );

            if (!confirmation) {
                return;
            }

            const anciennesInscriptions = [...inscriptions];

            inscriptions = inscriptions.filter(function(element) {
                return String(element.id) !== String(id);
            });

            if (!sauvegarderInscriptions()) {
                inscriptions = anciennesInscriptions;
                return;
            }

            afficherInscriptions();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener("input", function() {
        pageActuelle = 1;
        afficherInscriptions();
    });
}

if (statusFilter) {
    statusFilter.addEventListener("change", function() {
        pageActuelle = 1;
        afficherInscriptions();
    });
}

if (courseFilter) {
    courseFilter.addEventListener("change", function() {
        pageActuelle = 1;
        afficherInscriptions();
    });
}

if (sortFilter) {
    sortFilter.addEventListener("change", function() {
        pageActuelle = 1;
        afficherInscriptions();
    });
}

if (previousButton) {
    previousButton.addEventListener("click", function() {
        if (pageActuelle > 1) {
            pageActuelle--;
            afficherInscriptions();
        }
    });
}

if (nextButton) {
    nextButton.addEventListener("click", function() {
        const nombrePages = Math.ceil(
            obtenirInscriptionsFiltrees().length / INSCRIPTIONS_PAR_PAGE
        );

        if (pageActuelle < nombrePages) {
            pageActuelle++;
            afficherInscriptions();
        }
    });
}

if (exportButton) {
    exportButton.addEventListener("click", function() {
        const resultat = obtenirInscriptionsFiltrees();

        if (resultat.length === 0) {
            alert("Aucune inscription à exporter.");
            return;
        }

        const entetes = [
            "N° dossier",
            "Élève",
            "Niveau",
            "Cours",
            "Téléphone parent",
            "Statut",
            "Date"
        ];

        const lignes = resultat.map(function(inscription) {
            return [
                inscription.id,
                inscription.name,
                inscription.level,
                inscription.course,
                inscription.phone,
                inscription.status,
                formaterDate(inscription.date)
            ];
        });

        function champCSV(valeur) {
            let texte = String(valeur ? valeur : "");

            if (/^[\s]*[=+\-@\t\r]/.test(texte)) {
                texte = "'" + texte;
            }

            return '"' + texte.replace(/"/g, '""') + '"';
        }

        const contenu = [entetes, ...lignes]
            .map(function(ligne) {
                return ligne.map(champCSV).join(";");
            })
            .join("\r\n");

        const fichier = new Blob(
            ["\uFEFF" + contenu], { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(fichier);
        const lien = document.createElement("a");

        lien.href = url;
        lien.download = "inscriptions-nour-academy.csv";

        document.body.appendChild(lien);
        lien.click();
        lien.remove();

        URL.revokeObjectURL(url);
    });
}

if (resetButton) {
    resetButton.addEventListener("click", function() {
        const confirmation = confirm(
            "Attention ! Voulez-vous vraiment supprimer toutes les inscriptions ?"
        );

        if (!confirmation) {
            return;
        }

        const anciennesInscriptions = [...inscriptions];
        inscriptions = [];

        if (!sauvegarderInscriptions()) {
            inscriptions = anciennesInscriptions;
            return;
        }

        pageActuelle = 1;
        afficherInscriptions();
    });
}

chargerInscriptions();

if (sessionStorage.getItem("adminConnecte") === "oui") {
    afficherInscriptions();
}