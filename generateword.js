// Fonction pour charger le JSON et afficher un mot au hasard
fetch("dictionnary.json")
  .then((response) => response.json())
  .then((data) => {
    // Choisir un mot au hasard
    const randomWord = data[Math.floor(Math.random() * data.length)];

    // Créer les éléments HTML pour afficher le mot
    const container = document.createElement("div");
    container.innerHTML = `
            <h1>${randomWord.Mot}</h1>
            <p><strong>Définition :</strong> ${randomWord.Définition}</p>
            <p><strong>Exemple :</strong> ${randomWord.Exemple}</p>
            <p><strong>Type :</strong> ${randomWord.Type}</p>
            <p><strong>Difficulté :</strong> ${randomWord.Difficulté}</p>
        `;

    // Ajouter dans le body
    document.body.appendChild(container);
  })
  .catch((error) => {
    console.error("Erreur lors du chargement du dictionnaire :", error);
  });
