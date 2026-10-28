// Gera a versão publicada (pasta docs/) e envia para o GitHub se algo mudou.
// Uso: node publicar.js            -> gera e envia
//      node publicar.js --so-gerar -> só gera a pasta docs/, sem enviar
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { SISTEMAS, carregar } = require("./dados");

const DOCS = path.join(__dirname, "docs");

// Marca app.js e estilo.css com a "versão" (resumo do conteúdo) nas páginas, para o navegador
// não usar a cópia antiga do cache do GitHub Pages depois de uma atualização da tela.
const versao = (arq) => crypto.createHash("sha1").update(fs.readFileSync(arq)).digest("hex").slice(0, 8);

function gerar() {
  fs.mkdirSync(DOCS, { recursive: true });
  const pub = path.join(__dirname, "public");
  const arquivos = fs.readdirSync(pub);
  for (const arq of arquivos) {
    if (!arq.endsWith(".html")) { fs.copyFileSync(path.join(pub, arq), path.join(DOCS, arq)); continue; }
    let html = fs.readFileSync(path.join(pub, arq), "utf8");
    for (const dep of arquivos.filter((a) => /\.(js|css)$/.test(a))) {
      html = html.split(`"${dep}"`).join(`"${dep}?v=${versao(path.join(pub, dep))}"`);
    }
    fs.writeFileSync(path.join(DOCS, arq), html);
  }
  for (const [id, cfg] of Object.entries(SISTEMAS)) {
    if (fs.existsSync(cfg.pasta)) fs.writeFileSync(path.join(DOCS, cfg.arquivo), JSON.stringify(carregar(id)));
  }
  fs.writeFileSync(path.join(DOCS, ".nojekyll"), "");
}

const git = (...args) => execFileSync("git", args, { cwd: __dirname, encoding: "utf8" }).trim();

function enviar() {
  if (!fs.existsSync(path.join(__dirname, ".git"))) return "sem repositório git, só gerei a pasta docs/";
  git("add", "-A");
  if (!git("status", "--porcelain")) return "nada mudou";
  const quando = new Date().toLocaleString("pt-BR");
  git("commit", "-m", `Atualização automática do conteúdo (${quando})`);
  git("push");
  return "enviado para o GitHub";
}

function publicar({ soGerar = false } = {}) {
  gerar();
  return soGerar ? "pasta docs/ gerada" : enviar();
}

module.exports = { publicar };

if (require.main === module) {
  try {
    console.log(publicar({ soGerar: process.argv.includes("--so-gerar") }));
  } catch (e) {
    console.error("Falha ao publicar:", e.message);
    process.exit(1);
  }
}
