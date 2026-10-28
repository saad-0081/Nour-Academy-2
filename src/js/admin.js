const data = JSON.parse(localStorage.getItem("inscriptions")) || [];

const liste = document.querySelector("#registrationTable");
const form = document.querySelector("#registrationForm");
const modal = document.querySelector("#registrationModal");
const editId = document.querySelector("#editId");

const fields = {
    name: document.querySelector("#studentName"),
    level: document.querySelector("#studentLevel"),
    course: document.querySelector("#studentCourse"),
    phone: document.querySelector("#parentPhone"),
    status: document.querySelector("#registrationStatus")
};

function save() {
    localStorage.setItem("inscriptions", JSON.stringify(data));
}

function render(apprenants = data) {
    liste.innerHTML = "";

    apprenants.forEach(element => {
        const ligne = document.createElement("tr");

        ligne.innerHTML = `
      <td class="px-4 py-3">${element.id}</td>
      <td class="px-4 py-3">${element.name}</td>
      <td class="px-4 py-3">${element.level}</td>
      <td class="px-4 py-3">${element.course}</td>
      <td class="px-4 py-3">${element.phone}</td>
      <td class="px-4 py-3">${element.status}</td>
      <td class="px-4 py-3">${element.date || ""}</td>
      <td class="px-4 py-3">
        <button class="button" data-action="edit" data-id="${element.id}">Modifier</button>
        <button class="button" data-action="delete" data-id="${element.id}">Supprimer</button>
      </td>
    `;

        liste.append(ligne);
    });

    const count = document.querySelector("#resultCount");
    if (count) count.textContent = apprenants.length + " inscription(s)";
}

function openModal(element) {
    form.reset();
    editId.value = element ? element.id : "";

    Object.keys(fields).forEach(key => {
        fields[key].value = element ? element[key] || "" : "";
    });

    if (!element) fields.status.value = "En attente";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    form.reset();
    editId.value = "";
}

document.querySelector("#openModalButton").addEventListener("click", () => {
    openModal(null);
});

document.querySelector("#closeModalButton").addEventListener("click", closeModal);
document.querySelector("#cancelButton").addEventListener("click", closeModal);

form.addEventListener("submit", event => {
    event.preventDefault();

    const inscription = {};

    Object.keys(fields).forEach(key => {
        inscription[key] = fields[key].value.trim();
    });

    if (Object.values(inscription).some(value => value === "")) {
        alert("Remplissez tous les champs.");
        return;
    }

    if (editId.value) {
        const element = data.find(item => item.id == editId.value);
        Object.assign(element, inscription);
    } else {
        inscription.id = Date.now();
        inscription.date = new Date().toLocaleDateString("fr-FR");
        data.push(inscription);
    }

    save();
    closeModal();
    render();
});

liste.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const element = data.find(item => item.id === id);

    if (!element) return;

    if (button.dataset.action === "edit") {
        openModal(element);
    }

    if (button.dataset.action === "delete") {
        if (confirm("Supprimer cette inscription ?")) {
            data.splice(data.indexOf(element), 1);
            save();
            render();
        }
    }
});

const search = document.querySelector("#searchInput");

search.addEventListener("input", () => {
    const mot = search.value.toLowerCase();

    const resultat = data.filter(element =>
        element.name.toLowerCase().includes(mot) ||
        element.phone.includes(mot)
    );

    render(resultat);
});

document.querySelector("#logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("adminConnecte");
    sessionStorage.removeItem("roleConnecte");
    location.href = "index.html";
});

render();