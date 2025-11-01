// inject-key.js
const fs = require("fs");
const path = require("path");

// Caminhos dos arquivos
const inPath = path.join(__dirname, "projeto", "pontos.template.html");
const outPath = path.join(__dirname, "projeto", "pontos.html");

console.log("📁 Diretório atual:", __dirname);
console.log("📄 Template de entrada:", inPath);
console.log("📄 Arquivo de saída:", outPath);

// Lê a chave da API do Google Maps
const key = process.env.GOOGLE_MAPS_API_KEY;

if (!key) {
  console.error("❌ Erro: variável GOOGLE_MAPS_API_KEY não encontrada.");
  process.exit(1);
}

// Lê o conteúdo do template
let content;
try {
  content = fs.readFileSync(inPath, "utf8");
} catch (err) {
  console.error(`❌ Erro ao ler o template: ${err.message}`);
  process.exit(1);
}

// Substitui o placeholder pela chave real
content = content.replace(/__GOOGLE_MAPS_KEY__/g, key);

// Salva o HTML final
try {
  fs.writeFileSync(outPath, content, "utf8");
  console.log("✅ pontos.html gerado com sucesso com a chave do Google Maps!");
} catch (err) {
  console.error(`❌ Erro ao escrever o arquivo final: ${err.message}`);
  process.exit(1);
}
