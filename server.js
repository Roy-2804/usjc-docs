const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Ruta a la carpeta donde está el build de React
const buildPath = path.join(__dirname, "dist"); // o "build" si usás CRA

// Servir archivos estáticos (JS, CSS, etc.)
app.use(express.static(buildPath));

// Ruta para servir el index.html en cualquier path (React Router compatible)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Frontend corriendo en http://localhost:${port}`);
});
