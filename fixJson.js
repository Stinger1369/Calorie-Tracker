const fs = require("fs");

// Chemin vers le fichier JSON
const filePath = "./nest.recomandationFood_fixed.json";

// Lire le fichier JSON
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Erreur lors de la lecture du fichier:", err);
    return;
  }

  try {
    // Parse le contenu du fichier en tant que tableau d'objets
    let jsonData = JSON.parse(data);

    // Parcourir chaque élément pour convertir l'_id en objet MongoDB avec $oid
    jsonData = jsonData.map((doc) => {
      if (doc._id && typeof doc._id === "string") {
        doc._id = { $oid: doc._id }; // Convertit la chaîne en un objet avec $oid
      }
      return doc;
    });

    // Convertir les données modifiées en chaîne JSON
    const updatedJsonData = JSON.stringify(jsonData, null, 2);

    // Sauvegarder les données dans un nouveau fichier ou écraser l'existant
    fs.writeFile(
      "./nest.recomandationFood_with_oid.json",
      updatedJsonData,
      "utf8",
      (err) => {
        if (err) {
          console.error("Erreur lors de la sauvegarde du fichier:", err);
        } else {
          console.log("Fichier modifié et sauvegardé avec succès!");
        }
      }
    );
  } catch (err) {
    console.error("Erreur lors du parsing du fichier JSON:", err);
  }
});
