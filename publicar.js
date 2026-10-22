// Gera a versão publicada (pasta docs/) e envia para o GitHub se algo mudou.
// Uso: node publicar.js            -> gera e envia
//      node publicar.js --so-gerar -> só gera a pasta docs/, sem enviar
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { carregar } = require("./dados");

const DOCS = path.join(__dirname, "docs");

function gerar() {
  fs.mkdirSync(DOCS, { recursive: true });
  fs.copyFileSync(path.join(__dirname, "public", "index.html"), path.join(DOCS, "index.html"));
  fs.writeFileSync(path.join(DOCS, "conteudo.json"), JSON.stringify(carregar()));
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
