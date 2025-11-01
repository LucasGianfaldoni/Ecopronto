// inject-key.js
const fs = require("fs");
const path = require("path");

const key = process.env.GOOGLE_MAPS_API_KEY;
if (!key) {
  console.error("❌ Erro: variável GOOGLE_MAPS_API_KEY não encontrada.");
  process.exit(1);
}

// ✅ Caminho correto (não precisa incluir "projeto")
const inPath = path.join(__dirname, "public", "pontos.template.html");
const outPath = path.join(__dirname, "public", "pontos.html");

// ✅ Agora sim, pode logar
console.log("📁 Diretório atual:", __dirname);
console.log("📄 Procurando arquivo em:", inPath);

let content = fs.readFileSync(inPath, "utf8");
content = content.replace(/__GOOGLE_MAPS_KEY__/g, key);
fs.writeFileSync(outPath, content, "utf8");

console.log("✅ pontos.html gerado com sucesso com a chave do Google Maps.");
