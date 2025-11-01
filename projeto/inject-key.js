// inject-key.js
const fs = require("fs");
const path = require("path");

const key = process.env.GOOGLE_MAPS_API_KEY;
if (!key) {
  console.error("❌ Erro: variável GOOGLE_MAPS_API_KEY não encontrada.");
  process.exit(1);
}

const inPath = path.join(__dirname, "public", "pontos..html");
const outPath = path.join(__dirname, "public", "pontos.html");

let content = fs.readFileSync(inPath, "utf8");
content = content.replace(/__GOOGLE_MAPS_KEY__/g, key);
fs.writeFileSync(outPath, content, "utf8");

console.log("✅ pontos.html gerado com sucesso com a chave do Google Maps.");
