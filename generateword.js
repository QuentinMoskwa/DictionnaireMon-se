let dictionnaire = [];

fetch("dictionnary.json")
    .then((response) => response.json())
    .then((data) => {
        dictionnaire = data;
        afficherMotAleatoire();
        genererListe();
    })
    .catch((error) => {
        console.error("Erreur lors du chargement du dictionnaire :", error);
    });

function afficherMotAleatoire() {
  if (dictionnaire.length === 0) return;
  document.getElementById("nouveauMotBtn").style.display = "inline-block";
  const randomWord =
    dictionnaire[Math.floor(Math.random() * dictionnaire.length)];
  const stars = "*".repeat(randomWord.Difficulté);
  const container = document.getElementById("mot-container");
  container.innerHTML = `
        <h1>${randomWord.Mot} <span class="stars">${stars}</span></h1>
        <p class="definition">${randomWord.Définition}</p>
        <p class="definition">${randomWord.Exemple}</p>
    `;
}
    

function genererListe() {
    const liste = document.getElementById("liste-mots");
    dictionnaire.forEach(mot => {
        const li = document.createElement("li");
        li.textContent = mot.Mot;
        li.onclick = () => afficherMotSpecifique(mot);
        liste.appendChild(li);
    });
}

function afficherMotSpecifique(mot) {
  document.getElementById("aleatoireView").classList.remove("hidden");
  document.getElementById("listeView").classList.add("hidden");

  // Masquer le bouton "J'en veux un autre !"
  document.getElementById("nouveauMotBtn").style.display = "none";

  const stars = "*".repeat(mot.Difficulté);
  const container = document.getElementById("mot-container");
  container.innerHTML = `
        <h1>${mot.Mot} <span class="stars">${stars}</span></h1>
        <p class="definition">${mot.Définition}</p>
        <p class="definition">${mot.Exemple}</p>
    `;
}


document.getElementById("listeBtn").onclick = () => {
    document.getElementById("aleatoireView").classList.add("hidden");
    document.getElementById("listeView").classList.remove("hidden");
};

document.getElementById("aleatoireBtn").onclick = () => {
  document.getElementById("aleatoireView").classList.remove("hidden");
  document.getElementById("listeView").classList.add("hidden");
  afficherMotAleatoire(); // nouveau mot
};

document.getElementById("nouveauMotBtn").onclick = () => {
  afficherMotAleatoire(); // juste un nouveau mot, pas besoin de changer de vue
};
