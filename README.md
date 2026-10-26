# Nour Academy — Gestion des inscriptions

## 1. Présentation du projet

Nour Academy est un réseau de trois centres de soutien scolaire et de langues situés à Nador Centre, Hay Al Matar et Selouane.

Ce projet consiste à développer une application web de gestion des inscriptions destinée au secrétariat. Elle permet de consulter, ajouter, modifier et supprimer les dossiers des élèves, ainsi que de faciliter le suivi des inscriptions.

## 2. Objectifs

- Centraliser les inscriptions des élèves.
- Afficher la liste des inscriptions dans un tableau.
- Ajouter, modifier et supprimer une inscription.
- Empêcher les inscriptions en double.
- Limiter chaque groupe à 15 élèves.
- Rechercher, filtrer et trier les inscriptions.
- Afficher un tableau de bord avec des statistiques.
- Exporter les données au format CSV.
- Améliorer l'accessibilité et l'utilisation sur mobile.

## 3. Technologies utilisées

- **HTML5** : structure des pages.
- **CSS3** : mise en forme et design responsive.
- **JavaScript (ES Modules)** : fonctionnalités et gestion des données.
- **localStorage** : sauvegarde des données dans le navigateur.
- **sessionStorage** : conservation temporaire des recherches et des filtres.
- **Git et GitHub** : gestion des versions et collaboration.
- **Jira** : organisation des tâches et suivi du sprint.

## 4. Fonctionnalités principales

- Gestion CRUD des inscriptions : créer, lire, modifier et supprimer.
- Validation des formulaires.
- Vérification des doublons.
- Contrôle de la capacité maximale des groupes.
- Recherche, filtres et tri.
- Tableau de bord et statistiques.
- Exportation CSV et pagination.
- Interface responsive et accessible.

## 5. Structure du projet

```text
nour-academy/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── storage.js
│   ├── inscriptions.js
│   └── validation.js
└── README.md
```

*Cette structure est indicative et peut être adaptée aux fichiers existants du projet.*

## 6. Installation et lancement

1. Cloner le dépôt GitHub :

   ```bash
   git clone URL_DU_DEPOT
   ```

2. Entrer dans le dossier du projet :

   ```bash
   cd nour-academy
   ```

3. Ouvrir le dossier dans Visual Studio Code.

4. Lancer `index.html` avec l'extension **Live Server**.

## 7. Organisation du travail

Le projet est développé en équipe de deux membres.

- **Jira** : gestion des Epics, Stories, tâches et sprints.
- **GitHub** : dépôt du code source et collaboration.
- **Branches** : chaque fonctionnalité est développée dans une branche dédiée.
- **Pull Requests** : les modifications sont vérifiées avant leur intégration dans `develop`.

Branches principales :

- `main` : version stable.
- `develop` : branche de développement.
- `feature/nom-fonctionnalite` : nouvelle fonctionnalité.

## 8. Tests et validation

Les tests portent notamment sur :

- L'ajout et la modification des inscriptions.
- La suppression avec confirmation.
- La détection des doublons.
- La limite de 15 élèves par groupe.
- La recherche et les filtres.
- La sauvegarde et la récupération des données.
- L'accessibilité et l'affichage sur mobile.

## 9. Équipe

SAAD EL MOUDNIB
AHMAD BOUDALLAA
