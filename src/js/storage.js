const STORAGE_KEY = "inscriptions";

export function getInscriptions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        const inscriptions = JSON.parse(data);
        return Array.isArray(inscriptions) ? inscriptions : [];
    } catch (error) {
        console.error("Erreur de lecture :", error);
        return [];
    }
}

export function saveInscriptions(inscriptions) {
    if (!Array.isArray(inscriptions)) {
        throw new TypeError("Les inscriptions doivent être un tableau.");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscriptions));
}