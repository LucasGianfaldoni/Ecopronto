const fs = require("fs");
const path = require("path");
console.log("🔍 GOOGLE_MAPS_API_KEY =", process.env.GOOGLE_MAPS_API_KEY || "❌ não encontrada");
console.log("🔧 Iniciando script de injeção da chave do Google Maps...");

// 1️⃣ Verifica se a variável de ambiente existe
const key = process.env.GOOGLE_MAPS_API_KEY;
if (!key) {
  console.error("❌ ERRO: Variável GOOGLE_MAPS_API_KEY não encontrada.");
  process.exit(1);
}
console.log("✅ Variável GOOGLE_MAPS_API_KEY detectada.");

// 2️⃣ Determina automaticamente o caminho do arquivo template
const possiblePaths = [
  path.join(__dirname, "pontos.template.html"),
  path.join(__dirname, "projeto", "pontos.template.html"),
  path.join(__dirname, "public", "pontos.template.html"),
];

let inPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    inPath = p;
    break;
  }
}

if (!inPath) {
  console.error("❌ ERRO: Nenhum arquivo pontos.template.html encontrado.");
  console.log("Caminhos verificados:");
  possiblePaths.forEach((p) => console.log(" - " + p));
  process.exit(1);
}

console.log("📄 Template encontrado em:", inPath);

// 3️⃣ Define o caminho de saída (mesma pasta do template)
const outPath = path.join(path.dirname(inPath), "pontos.html");

// 4️⃣ Lê o conteúdo e substitui a chave
let content = fs.readFileSync(inPath, "utf8");
content = content.replace(/__GOOGLE_MAPS_KEY__/g, key);

// 5️⃣ Gera o novo arquivo
fs.writeFileSync(outPath, content, "utf8");

console.log("✅ pontos.html gerado com sucesso em:", outPath);

// 6️⃣ Confere se a chave foi realmente substituída
if (content.includes("__GOOGLE_MAPS_KEY__")) {
  console.error("⚠️ Atenção: A chave NÃO foi substituída!");
} else {
  console.log("🔑 A chave foi injetada corretamente no HTML!");
}
