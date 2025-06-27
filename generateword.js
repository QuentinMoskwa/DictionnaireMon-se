function afficherMotAleatoire() {
  fetch("dictionnary.json")
    .then((response) => response.json())
    .then((data) => {
      // Choisir un mot au hasard
      const randomWord = data[Math.floor(Math.random() * data.length)];

      // Générer les étoiles selon la difficulté
      const stars = "*".repeat(randomWord.Difficulté);

      // Nettoyer le contenu précédent
      const container = document.getElementById("mot-container");
      container.innerHTML = `
                <div class="starsAndTitle">
                    <h1>${randomWord.Mot}</h1>
                    <p class="stars">${stars}</p>
                </div>
                <p><strong>Définition :</strong> ${randomWord.Définition}</p>
                <p><strong>Exemple :</strong> ${randomWord.Exemple}</p>
                <p><strong>Type :</strong> ${randomWord.Type}</p>
            `;
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du dictionnaire :", error);
    });
}

// Appeler la fonction dès le chargement de la page
window.onload = afficherMotAleatoire;
