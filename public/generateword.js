let dictionnaire = [];

fetch("dictionnary.json")
    .then((response) => response.json())
    .then((data) => {
    dictionnaire = data;
    afficherMotDepuisURL(); 
    afficherMotAleatoire();
    genererListe();
  })
    .catch((error) => {
        console.error("Erreur lors du chargement du dictionnaire :", error);
    });

function afficherMotAleatoire() {
  if (dictionnaire.length === 0) return;

  document.getElementById("nouveauMotBtn").style.display = "inline-block";

  const randomWord = dictionnaire[Math.floor(Math.random() * dictionnaire.length)];
  const stars = "*".repeat(randomWord.Difficulté);
  const container = document.getElementById("mot-container");

  container.innerHTML = `
        <h1>${randomWord.Mot} <span class="stars">${stars}</span></h1>
        <p class="definition">${randomWord.Définition}</p>
        <p class="definition">${randomWord.Exemple}</p>
    `;

  window.history.pushState({}, "", `/${randomWord.Mot}`);
}
    

function genererListe() {
  const liste = document.getElementById("liste-mots");

  // Vider la liste si jamais elle a déjà été générée
  liste.innerHTML = "";

  // Trier par ordre alphabétique (insensible à la casse)
  const motsTries = dictionnaire.slice().sort((a, b) => {
    return a.Mot.localeCompare(b.Mot, "fr", { sensitivity: "base" });
  });

  // Créer les éléments <li>
  motsTries.forEach((mot) => {
    const li = document.createElement("li");
    li.textContent = mot.Mot;
    li.onclick = () => afficherMotSpecifique(mot);
    liste.appendChild(li);
  });
}


function afficherMotSpecifique(mot) {
  document.getElementById("aleatoireView").classList.remove("hidden");
  document.getElementById("listeView").classList.add("hidden");

  document.getElementById("nouveauMotBtn").style.display = "none";

  const stars = "*".repeat(mot.Difficulté);
  const container = document.getElementById("mot-container");
  container.innerHTML = `
        <h1>${mot.Mot} <span class="stars">${stars}</span></h1>
        <p class="definition">${mot.Définition}</p>
        <p class="definition">${mot.Exemple}</p>
    `;
  window.history.pushState({}, "", `/${mot.Mot}`);
}


document.getElementById("listeBtn").onclick = () => {
    document.getElementById("aleatoireView").classList.add("hidden");
    document.getElementById("listeView").classList.remove("hidden");
    window.history.pushState({}, "", "/liste");
};

document.getElementById("aleatoireBtn").onclick = () => {
  document.getElementById("aleatoireView").classList.remove("hidden");
  document.getElementById("listeView").classList.add("hidden");
  afficherMotAleatoire(); // nouveau mot
};

document.getElementById("nouveauMotBtn").onclick = () => {
  afficherMotAleatoire(); // juste un nouveau mot, pas besoin de changer de vue
};

function afficherMotDepuisURL() {
    const path = window.location.pathname.slice(1); // enlève le premier '/'
    if (!path) return; // Si on est juste sur la page d'accueil

    const mot = dictionnaire.find(item => item.Mot.toLowerCase() === path.toLowerCase());
    if (mot) {
        afficherMotSpecifique(mot);
    } else {
        console.warn("Mot introuvable dans le dictionnaire :", path);
    }
}
