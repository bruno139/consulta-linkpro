// Consulta Link PRO / PDV+: servidor local sem dependências.
// Lê as transcrições das pastas Link_PRO e PDV_Plus a cada carregamento, então vídeos novos aparecem sozinhos.
// Se esta pasta for um repositório git ligado ao GitHub, também publica sozinho quando essas pastas mudam.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { SISTEMAS, carregar } = require("./dados");
const { publicar } = require("./publicar");

const PORTA = Number(process.env.PORT) || 3001;
const ESPERA_MS = 15000; // espera a pasta "assentar" antes de publicar (vários arquivos mudam juntos)

const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
// Endereço do arquivo de dados -> sistema (conteudo.json = Link PRO, conteudo-pdv.json = PDV+).
const DADOS = Object.fromEntries(Object.entries(SISTEMAS).map(([id, cfg]) => ["/" + cfg.arquivo, id]));
DADOS["/api/conteudo"] = "linkpro";

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const sistema = DADOS[url.pathname];
    if (sistema) {
      try {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(carregar(sistema)));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Erro ao ler a pasta " + SISTEMAS[sistema].pasta + ": " + e.message);
      }
      return;
    }
    const arquivo = path.join(__dirname, "public", url.pathname === "/" ? "index.html" : path.normalize(url.pathname));
    if (!arquivo.startsWith(path.join(__dirname, "public")) || !fs.existsSync(arquivo)) {
      res.writeHead(404);
      return res.end("Não encontrado");
    }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(arquivo)] || "application/octet-stream" });
    fs.createReadStream(arquivo).pipe(res);
  })
  .listen(PORTA, () => {
    console.log(`Consulta Link PRO / PDV+ em http://localhost:${PORTA}`);
    for (const [id, cfg] of Object.entries(SISTEMAS)) console.log(`Lendo ${id}: ${cfg.pasta}`);
    sincronizar();
  });

// ---------- publicação automática
function sincronizar() {
  if (!fs.existsSync(path.join(__dirname, ".git")) || process.env.SEM_PUBLICAR) return;
  let timer;
  const rodar = (motivo) => {
    try {
      console.log(`[${new Date().toLocaleTimeString("pt-BR")}] ${motivo}: ${publicar()}`);
    } catch (e) {
      console.error(`[${new Date().toLocaleTimeString("pt-BR")}] Falha ao publicar: ${e.message}`);
    }
  };
  const agendar = (motivo) => () => {
    clearTimeout(timer);
    timer = setTimeout(() => rodar(motivo), ESPERA_MS);
  };
  rodar("Ao iniciar"); // pega mudanças feitas enquanto o app estava fechado
  for (const [id, cfg] of Object.entries(SISTEMAS)) {
    if (fs.existsSync(cfg.pasta)) fs.watch(cfg.pasta, { recursive: true }, agendar(`Pasta do ${id} mudou`));
    else console.log(`Aviso: a pasta do ${id} não existe (${cfg.pasta}).`);
  }
  fs.watch(path.join(__dirname, "public"), agendar("Tela mudou"));
  fs.watch(path.join(__dirname, "modulos.js"), agendar("Regras de módulos mudaram"));
  fs.watch(path.join(__dirname, "modulos-pdv.js"), agendar("Regras de módulos do PDV+ mudaram"));
  console.log("Publicação automática ligada: mudanças nas pastas Link_PRO e PDV_Plus vão para o site em cerca de 1 minuto.");
}
