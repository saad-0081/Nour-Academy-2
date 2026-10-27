localStorage.setItem("inscriptions", JSON.stringify([{
        dossier: "DOS-0001",
        eleve: "Amine El Idrissi",
        cours: "Mathématiques",
        centre: "Casablanca",
        statut: "Validée"
    },
    {
        dossier: "DOS-0002",
        eleve: "Sara Alaoui",
        cours: "Français",
        centre: "Rabat",
        statut: "En attente"
    }
]));

location.reload();