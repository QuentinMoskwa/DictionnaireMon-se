const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));


app.get("/app/mot/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "public/mot.html"));
});


app.all('/{*any}', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
