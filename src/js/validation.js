  const loginForm = document.querySelector("#loginForm");
        const roleInput = document.querySelector("#role");
        const usernameInput = document.querySelector("#username");
        const passwordInput = document.querySelector("#password");
        const loginError = document.querySelector("#loginError");
        const comptes = {
            admin: {
                username: "admin",
                password: "Nour2026",
                page: "admin.html"
            },
            secretaire: {
                username: "secretaire",
                password: "Secret2026",
                page: "secraitaire.html"
            }
        };
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const role = roleInput.value;
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const compte = comptes[role];
            if (
                username === compte.username &&
                password === compte.password
            ) {
                sessionStorage.setItem("roleConnecte", role);
                if (role === "admin") {
                    sessionStorage.setItem("adminConnecte", "oui");
                    sessionStorage.removeItem("secretaireConnecte");
                } else {
                    sessionStorage.setItem("secretaireConnecte", "oui");
                    sessionStorage.removeItem("adminConnecte");
                }
                window.location.href = compte.page;
            } else {
                loginError.classList.remove("hidden");
            }
        });
        roleInput.addEventListener("change", function() {
            loginError.classList.add("hidden");
        });