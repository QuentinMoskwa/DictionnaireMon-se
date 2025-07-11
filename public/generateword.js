const coeurSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
             4.5 2.09C13.09 3.81 14.76 3 16.5 3 
             19.58 3 22 5.42 22 8.5c0 3.78-3.4 
             6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;
let filtreFavorisActif = false;

const btnFiltre = document.getElementById("filtreFavorisBtn");

btnFiltre.addEventListener("click", () => {
  filtreFavorisActif = !filtreFavorisActif;
  btnFiltre.classList.toggle("favori", filtreFavorisActif);
  btnFiltre.setAttribute("aria-pressed", filtreFavorisActif);
  genererListe();
});

function getFavoris() {
  return JSON.parse(localStorage.getItem("favoris")) || [];
}

function toggleFavori(mot) {
  const favoris = getFavoris();
  const index = favoris.indexOf(mot);
  const ajout = index === -1;

  if (ajout) {
    favoris.push(mot);
    // Incrémenter le compteur sur le serveur
    fetch("/api/favori", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mot: mot, action: "increment" }),
    });
  } else {
    favoris.splice(index, 1);
    // Décrémenter le compteur sur le serveur
    fetch("/api/favori", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mot: mot, action: "decrement" }),
    });
  }

  localStorage.setItem("favoris", JSON.stringify(favoris));
}


function estFavori(mot) {
  return getFavoris().includes(mot);
}

let dictionnaire = [];

fetch("dictionnary.json")
  .then((response) => response.json())
  .then((data) => {
    dictionnaire = data;
    afficherTop10();
  })
  .catch((error) => {
    console.error("Erreur lors du chargement du dictionnaire :", error);
  });

function afficherMotAleatoire() {
  if (dictionnaire.length === 0) return;

  document.getElementById("nouveauMotBtn").style.display = "inline-block";
  document.getElementById("accueilView").classList.add("hidden");
  motActuel = dictionnaire[Math.floor(Math.random() * dictionnaire.length)];
  const stars = "*".repeat(motActuel.Difficulté);
  const container = document.getElementById("mot-container");
  const isFav = estFavori(motActuel.Mot);

  container.innerHTML = `
    <h1>
      <button class="fav-btn ${isFav ? "favori" : ""}" data-mot="${motActuel.Mot}">${coeurSVG}</button>
      ${motActuel.Mot} <span class="stars">${stars}</span>
    </h1>
    <p class="definition">${motActuel.Définition}</p>
    <p class="definition">${motActuel.Exemple}</p>
  `;

  document.querySelector(".fav-btn").addEventListener("click", (e) => {
    toggleFavori(motActuel.Mot);
    e.currentTarget.classList.toggle("favori", estFavori(motActuel.Mot));

  });

  window.history.pushState({}, "", `/${motActuel.Mot}`);
}

function genererListe() {
  const liste = document.getElementById("liste-mots");
  const afficherFavorisSeulement = filtreFavorisActif;

  liste.innerHTML = "";

  const favoris = getFavoris();

  const motsFiltres = dictionnaire
    .filter((mot) => !afficherFavorisSeulement || favoris.includes(mot.Mot))
    .sort((a, b) => a.Mot.localeCompare(b.Mot, "fr", { sensitivity: "base" }));

  motsFiltres.forEach((mot) => {
    const li = document.createElement("li");
    li.textContent = mot.Mot;
    li.onclick = () => afficherMotSpecifique(mot);
    liste.appendChild(li);
  });
}

function afficherMotSpecifique(mot) {
  document.getElementById("aleatoireView").classList.remove("hidden");
  document.getElementById("listeView").classList.add("hidden");
  document.getElementById("accueilView").classList.add("hidden");
  document.getElementById("nouveauMotBtn").style.display = "none";

  const stars = "*".repeat(mot.Difficulté);
  const container = document.getElementById("mot-container");
  const isFav = estFavori(mot.Mot);

  container.innerHTML = `
  <h1>
    <button class="fav-btn ${isFav ? "favori" : ""}" data-mot="${mot.Mot}">${coeurSVG}</button>
    ${mot.Mot} <span class="stars">${stars}</span>
  </h1>
  <p class="definition">${mot.Définition}</p>
  <p class="definition">${mot.Exemple}</p>
  `;

  document.querySelector(".fav-btn").addEventListener("click", (e) => {
    toggleFavori(mot.Mot);
    e.currentTarget.classList.toggle("favori", estFavori(mot.Mot));
  });

  window.history.pushState({}, "", `/${mot.Mot}`);
}

document.getElementById("listeBtn").onclick = () => {
  document.getElementById("aleatoireView").classList.add("hidden");
  document.getElementById("listeView").classList.remove("hidden");
  document.getElementById("accueilView").classList.add("hidden");
  window.history.pushState({}, "", "/liste");
  genererListe();
};

document.getElementById("aleatoireBtn").onclick = () => {
  document.getElementById("aleatoireView").classList.remove("hidden");
  document.getElementById("listeView").classList.add("hidden");
  document.getElementById("accueilView").classList.add("hidden");
  afficherMotAleatoire();
};

document.getElementById("nouveauMotBtn").onclick = () => {
  console.log("Nouveau mot demandé");
  afficherMotAleatoire();
};

function afficherMotDepuisURL() {
  const path = window.location.pathname.slice(1);
  if (!path) return;

  const mot = dictionnaire.find(
    (item) => item.Mot.toLowerCase() === path.toLowerCase()
  );
  if (mot) {
    afficherMotSpecifique(mot);
  } else {
    console.warn("Mot introuvable dans le dictionnaire :", path);
  }
}

function afficherTop10() {
  document.getElementById("aleatoireView").classList.add("hidden");
  document.getElementById("listeView").classList.add("hidden");
  document.getElementById("nouveauMotBtn").style.display = "none";

  fetch("top10.json")
    .then((response) => response.json())
    .then((data) => {
      const top10Container = document.getElementById("top10Container");
      top10Container.innerHTML = "";

      const ol = document.createElement("ol"); // Liste ordonnée

      data.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="top-mot">${item.mot}</span>
          <span class="top-compteur">❤️ ${item.count}</span>
        `;
        li.onclick = () => {
          const mot = dictionnaire.find(
            (entry) => entry.Mot.toLowerCase() === item.mot.toLowerCase()
          );
          if (mot) afficherMotSpecifique(mot);
        };
        ol.appendChild(li);
      });

      top10Container.appendChild(ol);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du top 10 :", error);
    });
}

