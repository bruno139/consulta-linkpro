// Lê as transcrições da pasta Link_PRO e monta o conteúdo usado pela tela (local e publicada).
const fs = require("fs");
const path = require("path");

const PASTA = process.env.LINK_PRO_DIR || path.resolve(__dirname, "..", "..", "Link_PRO", "saida_link_pro");
const PLAYLISTS = {
  tutoriais: "Tutorial",
  treinamentos: "Treinamento",
  "cadastro-de-produtos": "Cadastro de Produtos",
};

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function tituloCurto(titulo) {
  return titulo
    .replace(/^Link( PRO)?\s*-\s*/i, "")
    .replace(/^(Tutorial|Treinamento( de Cadastro de Produtos)?)\s*-\s*/i, "")
    .replace(/^Treinamento\s+/i, "")
    .replace(/\?$/, "")
    .trim();
}

function lerTranscricao(arquivo) {
  const linhas = fs.readFileSync(arquivo, "utf8").split(/\r?\n/);
  const titulo = (linhas[0] || "").replace(/^#\s*/, "").trim();
  const url = linhas.find((l) => l.startsWith("https://")) || "";
  const id = (url.match(/v=([\w-]+)/) || [])[1];
  const blocos = [];
  for (const l of linhas) {
    const m = l.match(/^\*\*(\d+:\d+)\*\*\s*\(\[abrir\]\([^)]*?t=(\d+)s\)\)\s*(.*)$/);
    if (m) blocos.push({ tempo: m[1], seg: Number(m[2]), texto: m[3].trim() });
  }
  return { titulo, id, url, blocos };
}

function carregar() {
  // Relido a cada chamada: assim mudanças em modulos.js também valem sem reiniciar.
  delete require.cache[require.resolve("./modulos")];
  const MODULOS = require("./modulos");
  const videos = new Map();
  for (const [pastaPl, nomePl] of Object.entries(PLAYLISTS)) {
    const dir = path.join(PASTA, pastaPl);
    if (!fs.existsSync(dir)) continue;
    for (const sub of fs.readdirSync(dir).sort()) {
      const arq = path.join(dir, sub, "transcricao.md");
      if (!fs.existsSync(arq)) continue;
      const v = lerTranscricao(arq);
      if (!v.id) continue;
      const existente = videos.get(v.id);
      if (existente) {
        if (!existente.tipos.includes(nomePl)) existente.tipos.push(nomePl);
        continue;
      }
      const chave = semAcento(v.titulo);
      const modulo = MODULOS.find((m) => m.regra.test(chave)).id;
      videos.set(v.id, {
        id: v.id,
        titulo: tituloCurto(v.titulo),
        tituloOriginal: v.titulo,
        url: v.url,
        tipos: [nomePl],
        modulo,
        duracao: v.blocos.length ? v.blocos[v.blocos.length - 1].tempo : "",
        blocos: v.blocos,
      });
    }
  }
  return {
    modulos: MODULOS.map(({ id, nome, descricao }) => ({ id, nome, descricao })),
    videos: [...videos.values()],
  };
}

module.exports = { PASTA, carregar };
