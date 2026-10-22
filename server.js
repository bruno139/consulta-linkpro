// Consulta Link PRO: servidor local sem dependências.
// Lê as transcrições da pasta Link_PRO a cada carregamento, então vídeos novos aparecem sozinhos.
// Se esta pasta for um repositório git ligado ao GitHub, também publica sozinho quando a pasta Link_PRO muda.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { PASTA, carregar } = require("./dados");
const { publicar } = require("./publicar");

const PORTA = Number(process.env.PORT) || 3001;
const ESPERA_MS = 15000; // espera a pasta "assentar" antes de publicar (vários arquivos mudam juntos)

const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/conteudo.json" || url.pathname === "/api/conteudo") {
      try {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(carregar()));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Erro ao ler a pasta " + PASTA + ": " + e.message);
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
    console.log(`Consulta Link PRO em http://localhost:${PORTA}`);
    console.log(`Lendo transcrições de: ${PASTA}`);
    sincronizar();
  });

// ---------- publicação automática
function sincronizar() {
  if (!fs.existsSync(path.join(__dirname, ".git"))) return;
  let timer;
  const rodar = (motivo) => {
    try {
      console.log(`[${new Date().toLocaleTimeString("pt-BR")}] ${motivo}: ${publicar()}`);
    } catch (e) {
      console.error(`[${new Date().toLocaleTimeString("pt-BR")}] Falha ao publicar: ${e.message}`);
    }
  };
  const agendar = () => {
    clearTimeout(timer);
    timer = setTimeout(() => rodar("Pasta Link_PRO mudou"), ESPERA_MS);
  };
  rodar("Ao iniciar"); // pega mudanças feitas enquanto o app estava fechado
  fs.watch(PASTA, { recursive: true }, agendar);
  fs.watch(path.join(__dirname, "public"), agendar);
  fs.watch(path.join(__dirname, "modulos.js"), agendar);
  console.log("Publicação automática ligada: mudanças na pasta Link_PRO vão para o site em cerca de 1 minuto.");
}
