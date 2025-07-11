const express = require("express");
const path = require("path");
const fs = require("fs");
const top10Path = path.join(__dirname, "public/top10.json");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


app.get("/:mot", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});


app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

app.post("/api/favori", (req, res) => {
  const { mot, action } = req.body;

  if (!mot || !action)
    return res.status(400).json({ error: "Mot ou action manquant" });

  fs.readFile(top10Path, "utf8", (err, data) => {
    let top = [];

    if (!err && data) {
      try {
        top = JSON.parse(data);
      } catch (e) {
        console.error("Erreur parsing top10.json", e);
      }
    }

    // Chercher si le mot existe déjà
    const entry = top.find((item) => item.mot === mot);

    if (entry) {
      if (action === "increment") {
        entry.count += 1;
      } else if (action === "decrement" && entry.count > 0) {
        entry.count -= 1;
      }
    } else if (action === "increment") {
      // Ajouter uniquement si on incrémente (nouveau mot)
      top.push({ mot: mot, count: 1 });
    }
    // Sinon, pas d'action si on veut décrémenter un mot inexistant

    // Trier par count décroissant et garder top 10
    top.sort((a, b) => b.count - a.count);
    top = top.slice(0, 10);

    // Écrire dans le fichier
    fs.writeFile(top10Path, JSON.stringify(top, null, 2), (err) => {
      if (err) {
        console.error("Erreur d’écriture :", err);
        return res.status(500).json({ error: "Écriture échouée" });
      }
      res.status(200).json({ message: "Top10 mis à jour" });
    });
  });
});
  
app.all('/{*any}', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});