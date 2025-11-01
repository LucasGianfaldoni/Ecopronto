// inject-key.js
const fs = require("fs");
const path = require("path");

// Caminhos dos arquivos
const inFile = path.join(__dirname, "projeto", "pontos.template.html");
const outFile = path.join(__dirname, "projeto", "pontos.html");

// Recupera a chave da API do ambiente
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.error("❌ Erro: a variável de ambiente GOOGLE_MAPS_API_KEY não foi definida.");
  process.exit(1);
}

// Lê o template
let content;
try {
  content = fs.readFileSync(inFile, "utf8");
} catch (err) {
  console.error(`❌ Erro ao ler o arquivo ${inFile}:`, err.message);
  process.exit(1);
}

// Substitui a variável placeholder pela chave real
content = content.replace(/__GOOGLE_MAPS_KEY__/g, apiKey);

// Salva o arquivo final
try {
  fs.writeFileSync(outFile, content, "utf8");
  console.log(`✅ Arquivo gerado com sucesso: ${outFile}`);
} catch (err) {
  console.error(`❌ Erro ao escrever o arquivo ${outFile}:`, err.message);
  process.exit(1);
}
