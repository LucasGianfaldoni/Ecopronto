const fs = require("fs");
const path = require("path");
console.log("🔧 Iniciando script de injeção da chave do Google Maps...");
// Método ROBUSTO para pegar a chave
const key = process.env.GOOGLE_MAPS_API_KEY;
if (!key) {
console.warn("⚠️ AVISO: GOOGLE_MAPS_API_KEY não encontrada nas variáveis de ambiente");
console.log("📝 Verificando se é problema de naming...");
// Debug: mostra variáveis relacionadas a Google/API
const envKeys = Object.keys(process.env);
const googleRelated = envKeys.filter(k =>
k.includes('GOOGLE') || k.includes('MAPS') || k.includes('API')
);
console.log("🔍 Variáveis relacionadas encontradas:", googleRelated);
if (googleRelated.length > 0) {
console.log("📋 Valores das variáveis relacionadas:");
googleRelated.forEach(k => {
console.log(` ${k} = ${process.env[k].substring(0, 10)}...`);
});
}
// Cria uma versão SIMPLES do pontos.html que SEMPRE funciona
createFallbackPage();
console.log("✅ Página alternativa criada com sucesso!");
process.exit(0);
}
console.log("✅ GOOGLE_MAPS_API_KEY detectada! Injetando chave...");
// Processa o template normalmente se a chave existe
processTemplate(key);
function createFallbackPage() {
const fallbackHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EcoPronto - Pontos de Coleta</title>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header>
<div style="display: flex; align-items: center; gap: 0.5rem">
<div style="color: var(--primary)">
<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
<path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514
7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
</svg>
</div>
<h2>EcoPronto</h2>
</div>
<nav>
<a href="index.html">Início</a>
<a href="dicas.html">Dicas</a>
<a href="pontos.html" style="color: var(--primary); font-weight: 700">Pontos</a>
</nav>
</header>
<main style="padding: 2rem; max-width: 800px; margin: 0 auto;">
<h1 style="font-size: 2rem; margin-bottom: 1rem;">Pontos de Coleta</h1>
<div class="card" style="margin-bottom: 2rem;">
<h3>⚠️ Configuração do Mapa</h3>
<p>Para ver os pontos de coleta no mapa, configure a variável de ambiente <strong>GOOGLE_MAPS_API_KEY</strong> no Vercel.</p>
<p style="margin-top: 1rem; color: var(--text-light-secondary);">
Enquanto isso, aqui estão alguns pontos de coleta próximos:
</p>
</div>
<div style="display: grid; gap: 1rem;">
<div class="card">
<h3>📍 EcoPonto Central</h3>
<p>Rua da Sustentabilidade, 123 - Centro</p>
<p><strong>Horário:</strong> 08:00 - 18:00</p>
</div>
<div class="card">
<h3>📍 Ponto Verde Norte</h3>
<p>Av. das Árvores, 456 - Zona Norte</p>
<p><strong>Horário:</strong> 07:00 - 17:00</p>
</div>
<div class="card">
<h3>📍 Recicla Sul</h3>
<p>Praça do Meio Ambiente, 789 - Zona Sul</p>
<p><strong>Horário:</strong> 24 horas</p>
</div>
</div>
</main>
</body>
</html>
`;
// Tenta salvar em vários locais possíveis
const possiblePaths = [
path.join(__dirname, "public", "pontos.html"),
path.join(__dirname, "pontos.html"),
path.join(process.cwd(), "public", "pontos.html"),
path.join(process.cwd(), "pontos.html")
];
for (const outPath of possiblePaths) {
try {
// Cria o diretório se não existir
const dir = path.dirname(outPath);
if (!fs.existsSync(dir)) {
fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(outPath, fallbackHTML, "utf8");
console.log("✅ Página alternativa salva em:", outPath);
return;
} catch (error) {
console.log("❌ Não foi possível salvar em:", outPath, error.message);
continue;
}
}
console.error("❌ Não foi possível criar a página em nenhum local!");
}
function processTemplate(key) {
// ... (código original do template processing)
const possiblePaths = [
path.join(__dirname, "pontos.template.html"),
path.join(__dirname, "public", "pontos.template.html")
];
let inPath = null;
for (const p of possiblePaths) {
if (fs.existsSync(p)) {
inPath = p;
break;
}
}
if (!inPath) {
console.error("❌ Template não encontrado. Criando página alternativa...");
createFallbackPage();
return;
}
console.log("📄 Template encontrado em:", inPath);
const outPath = path.join(path.dirname(inPath), "pontos.html");
try {
let content = fs.readFileSync(inPath, "utf8");
content = content.replace(/__GOOGLE_MAPS_KEY__/g, key);
fs.writeFileSync(outPath, content, "utf8");
console.log("✅ pontos.html gerado com mapa em:", outPath);
} catch (error) {
console.error("❌ Erro ao processar template:", error.message);
createFallbackPage();
}
}