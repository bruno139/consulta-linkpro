// Lê as transcrições de cada sistema (Link PRO e PDV+) e monta o conteúdo usado pela tela (local e publicada).
const fs = require("fs");
const path = require("path");

const AREA = path.resolve(__dirname, "..", "..");
// Primeira pasta que existir. As pastas foram movidas para "Site", mas o lugar antigo continua valendo.
const achar = (...opcoes) => opcoes.find((p) => fs.existsSync(p)) || opcoes[0];

const SISTEMAS = {
  linkpro: {
    pasta: process.env.LINK_PRO_DIR || achar(
      path.join(AREA, "Site", "Link_PRO", "saida_link_pro"),
      path.join(AREA, "Link_PRO", "saida_link_pro"),
    ),
    modulos: "./modulos",
    arquivo: "conteudo.json",
    prefixo: /^Link( PRO)?\s*-\s*/i,
  },
  pdv: {
    pasta: process.env.PDV_DIR || achar(
      path.join(AREA, "Site", "PDV_Plus", "saida_pdv_plus"),
      path.join(AREA, "PDV_Plus", "saida_pdv_plus"),
    ),
    modulos: "./modulos-pdv",
    arquivo: "conteudo-pdv.json",
    prefixo: /^Navi vendas\s*-\s*/i,
  },
};

// Nome bonito de cada pasta de playlist. Pastas novas entram sozinhas, com o nome tirado da própria pasta.
const ROTULOS = {
  tutoriais: "Tutorial",
  treinamentos: "Treinamento",
  "cadastro-de-produtos": "Cadastro de Produtos",
  demonstracoes: "Demonstração",
  novidades: "Novidades",
  "historico-de-versoes": "Histórico de versões",
  "sistemas-auxiliares": "Sistemas auxiliares",
  "demonstracoes-e-tutoriais-pdv-plus": "Demonstrações e tutoriais",
};
const rotulo = (pasta) => ROTULOS[pasta] || (pasta.charAt(0).toUpperCase() + pasta.slice(1)).replace(/[-_]+/g, " ");

function playlists(pasta) {
  if (!fs.existsSync(pasta)) return [];
  const ordem = Object.keys(ROTULOS);
  return fs.readdirSync(pasta, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name)
    .sort((a, b) => (ordem.indexOf(a) + 1 || 99) - (ordem.indexOf(b) + 1 || 99) || a.localeCompare(b));
}

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const entidades = (s) => s.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

function tituloCurto(titulo, prefixo) {
  return titulo
    .replace(prefixo, "")
    .replace(/^(Tutorial|Treinamento( de Cadastro de Produtos)?)\s*-\s*/i, "")
    .replace(/^Treinamento\s+/i, "")
    .replace(/\s#\S+/g, "")
    .replace(/\s+/g, " ")
    .replace(/[\s-]+$/, "")
    .replace(/\?$/, "")
    .trim();
}

// Letras de fala de verdade num trecho, sem [Música], ">>" e as palavras soltas que a legenda automática inventa.
const letras = (t) => t.replace(/\[m[uú]sica\]|>>|(^|\s)(voc[eê]|e a[ií])(?=\s|$)/giu, " ").replace(/[^\p{L}]+/gu, "").length;
// Vídeo com menos fala que isso é só música/telas: a legenda vira lixo ("Yun atitude Masu", ~40 letras).
// O tutorial mais curto do Link PRO tem ~100, então o limite fica entre os dois.
const MIN_LETRAS = 80;

function lerTranscricao(arquivo) {
  const linhas = fs.readFileSync(arquivo, "utf8").split(/\r?\n/);
  const titulo = (linhas[0] || "").replace(/^#\s*/, "").trim();
  const url = linhas.find((l) => l.startsWith("https://")) || "";
  const id = (url.match(/v=([\w-]+)/) || [])[1];
  let blocos = [];
  for (const l of linhas) {
    const m = l.match(/^\*\*(\d+:\d+)\*\*\s*\(\[abrir\]\([^)]*?t=(\d+)s\)\)\s*(.*)$/);
    if (m) blocos.push({ tempo: m[1], seg: Number(m[2]), texto: entidades(m[3].trim()) });
  }
  // Vídeo sem narração: não vale mostrar o texto da legenda. O roteiro (fase com imagens) também marca isso.
  const roteiro = path.join(path.dirname(arquivo), "roteiro.md");
  const marcado = fs.existsSync(roteiro) && fs.readFileSync(roteiro, "utf8").includes("sem fala aproveitável");
  const semFala = marcado || blocos.reduce((s, b) => s + letras(b.texto), 0) < MIN_LETRAS;
  blocos = semFala ? [] : blocos.filter((b) => letras(b.texto));
  return { titulo, id, url, blocos };
}

function carregar(sistema = "linkpro") {
  const cfg = SISTEMAS[sistema];
  // Relido a cada chamada: assim mudanças nas regras de módulos também valem sem reiniciar.
  delete require.cache[require.resolve(cfg.modulos)];
  const MODULOS = require(cfg.modulos);
  const videos = new Map();
  const tipos = [];
  for (const pastaPl of playlists(cfg.pasta)) {
    const dir = path.join(cfg.pasta, pastaPl);
    const nomePl = rotulo(pastaPl);
    tipos.push(nomePl);
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
        titulo: tituloCurto(v.titulo, cfg.prefixo),
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
    tipos,
    modulos: MODULOS.map(({ id, nome, descricao }) => ({ id, nome, descricao })),
    videos: [...videos.values()],
  };
}

module.exports = { SISTEMAS, PASTA: SISTEMAS.linkpro.pasta, carregar };
