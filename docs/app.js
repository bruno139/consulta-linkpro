const $ = (s) => document.querySelector(s);
const svg = (d) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICONES = {
  todos: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  caixa: svg('<path d="m5 11 3-6M19 11l-3-6"/><path d="M3 11h18l-1.6 7.2A2 2 0 0 1 17.4 20H6.6a2 2 0 0 1-2-1.8z"/><circle cx="12" cy="15" r="1.3"/>'),
  delivery: svg('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l-2-7h-3M13 10l2-4h3M15 6l3 11"/>'),
  estoque: svg('<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>'),
  produtos: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><path d="m17.5 2.5 4 4-4 4-4-4z"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  fiscal: svg('<path d="M6 2h9l4 4v16l-3-2-2 2-2-2-2 2-2-2-2 2z"/><path d="M9 9h6M9 13h6M14 2v4h5"/>'),
  financeiro: svg('<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/>'),
  etiquetas: svg('<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
  apps: svg('<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>'),
  versoes: svg('<path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  clientes: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>'),
  relatorios: svg('<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M8 16v-4M12 16V8M16 16v-6"/>'),
  config: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
};

// Configuração de cada sistema. A página escolhe pelo atributo data-sistema do <html>.
//   atalhos: [id do módulo (de modulos.js), nome curto, ícone] — o primeiro ("") é "Todos"
//   tipos:   nome e explicação de cada playlist nos cards (playlist sem entrada aparece com o próprio nome)
const SISTEMAS = {
  linkpro: {
    nome: "Consulta Link PRO",
    dados: "conteudo.json",
    pasta: "Link_PRO",
    exemplo: "Ex.: sangria, certificado digital, iFood, nota de entrada…",
    atalhos: [
      ["", "Todos", ICONES.todos], ["vendas", "Caixa", ICONES.caixa], ["restaurante", "Delivery", ICONES.delivery],
      ["estoque", "Estoque", ICONES.estoque], ["produtos", "Produtos", ICONES.produtos], ["fiscal", "Fiscal", ICONES.fiscal],
      ["financeiro", "Financeiro", ICONES.financeiro], ["equipamentos", "Etiquetas", ICONES.etiquetas], ["apps", "Apps", ICONES.apps],
      ["versoes", "Versões", ICONES.versoes], ["sistema", "Config", ICONES.config],
    ],
    tipos: {
      "Tutorial": ["Tutoriais", "passo a passo curtos"],
      "Treinamento": ["Treinamentos", "aulas completas por assunto"],
      "Cadastro de Produtos": ["Cadastro de Produtos", "série sobre o cadastro"],
      "Demonstração": ["Demonstrações", "apresentação dos sistemas"],
      "Novidades": ["Novidades", "lançamentos e o que mudou"],
      "Histórico de versões": ["Histórico de versões", "o que entrou em cada versão"],
      "Sistemas auxiliares": ["Sistemas auxiliares", "apps que trabalham com o Link"],
    },
  },
  pdv: {
    nome: "Consulta PDV+",
    dados: "conteudo-pdv.json",
    pasta: "PDV_Plus",
    exemplo: "Ex.: venda com Pix, iFood, monitor de cozinha, balanço de estoque…",
    atalhos: [
      ["", "Todos", ICONES.todos], ["caixa", "Caixa", ICONES.caixa], ["delivery", "Delivery", ICONES.delivery],
      ["estoque", "Estoque", ICONES.estoque], ["produtos", "Produtos", ICONES.produtos], ["clientes", "Clientes", ICONES.clientes],
      ["apps", "Apps", ICONES.apps], ["relatorios", "Relatórios", ICONES.relatorios], ["config", "Config", ICONES.config],
    ],
    tipos: {
      "Demonstrações e tutoriais": ["Demonstrações e tutoriais", "vídeos do PDV+ (Navi Vendas)"],
    },
  },
};
const SISTEMA = SISTEMAS[document.documentElement.dataset.sistema] || SISTEMAS.linkpro;
const ATALHOS = SISTEMA.atalhos;
const TIPOS = SISTEMA.tipos;
const PLAY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>';
const PARADAS = new Set("a o e de da do das dos um uma no na nos nas em para por com como que se ao os as".split(" "));
const estado = { modulo: "", tipo: "", q: "" };
let dados = { modulos: [], videos: [] };

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (n) => n.toLocaleString("pt-BR");

function termos(q) {
  const t = norm(q).split(/[^\p{L}\p{N}-]+/u).filter((x) => x && !PARADAS.has(x));
  return [...new Set(t)];
}

// Destaca os termos sem perder os acentos do texto original.
function destacar(texto, ts) {
  if (!ts.length) return esc(texto);
  const chars = [...texto];
  const n = chars.map((c) => norm(c)[0] || " ").join("");
  const marca = new Array(chars.length).fill(false);
  for (const t of ts) {
    let i = n.indexOf(t);
    while (i !== -1) { for (let k = i; k < i + t.length; k++) marca[k] = true; i = n.indexOf(t, i + 1); }
  }
  let out = "", dentro = false;
  chars.forEach((c, i) => {
    if (marca[i] && !dentro) { out += "<mark>"; dentro = true; }
    if (!marca[i] && dentro) { out += "</mark>"; dentro = false; }
    out += esc(c);
  });
  return out + (dentro ? "</mark>" : "");
}

// Recorta um trecho em volta do primeiro termo encontrado.
function recorte(texto, ts, tam = 230) {
  if (texto.length <= tam) return texto;
  const n = norm(texto);
  const pos = Math.min(...ts.map((t) => n.indexOf(t)).filter((i) => i >= 0), Infinity);
  let ini = pos === Infinity ? 0 : Math.max(0, pos - 70);
  if (ini > 0) ini = texto.indexOf(" ", ini) + 1;
  let fim = Math.min(texto.length, ini + tam);
  if (fim < texto.length) fim = texto.lastIndexOf(" ", fim);
  return (ini > 0 ? "… " : "") + texto.slice(ini, fim) + (fim < texto.length ? " …" : "");
}

function preparar() {
  for (const v of dados.videos) {
    v._titulo = norm(v.titulo + " " + v.tituloOriginal);
    v._blocos = v.blocos.map((b) => norm(b.texto));
    v._tudo = v._titulo + " " + v._blocos.join(" ");
  }
}

function buscar(ts) {
  const res = [];
  for (const v of dados.videos) {
    if (!ts.every((t) => v._tudo.includes(t))) continue;
    const noTitulo = ts.filter((t) => v._titulo.includes(t)).length;
    const blocos = [];
    v._blocos.forEach((b, i) => {
      const acertos = ts.filter((t) => b.includes(t)).length;
      if (acertos) blocos.push({ i, acertos });
    });
    blocos.sort((a, b) => b.acertos - a.acertos || a.i - b.i);
    const pontos = noTitulo * 20 + blocos.reduce((s, b) => s + b.acertos * b.acertos, 0);
    res.push({ v, blocos, pontos });
  }
  return res.sort((a, b) => b.pontos - a.pontos);
}

const nomeModulo = (id) => (dados.modulos.find((m) => m.id === id) || {}).nome || id;
const passa = (v, ignorar) =>
  (ignorar === "modulo" || !estado.modulo || v.modulo === estado.modulo) &&
  (ignorar === "tipo" || !estado.tipo || v.tipos.includes(estado.tipo));

// Cards de resumo = filtro por tipo; atalhos = filtro por módulo. Contagens respeitam a busca e o outro filtro.
function desenharFiltros(base) {
  $("#cards").innerHTML = (dados.tipos || Object.keys(TIPOS)).map((tipo) => {
    const [rot, sub] = TIPOS[tipo] || [tipo, ""];
    const n = base.filter((v) => v.tipos.includes(tipo) && passa(v, "tipo")).length;
    return `<button class="card ${estado.tipo === tipo ? "ativo" : ""}" data-tipo="${esc(tipo)}">
      <div class="rot">${rot}</div>
      <div class="valor">${fmt(n)} ${n === 1 ? "vídeo" : "vídeos"}</div>
      <div class="sub">${estado.tipo === tipo ? "Filtro ativo · clique para remover" : sub}</div>
    </button>`;
  }).join("");
  $("#atalhos").innerHTML = ATALHOS.map(([id, nome, icone]) => {
    const n = base.filter((v) => (!id || v.modulo === id) && passa(v, "modulo")).length;
    const ativo = estado.modulo === id;
    return `<button class="atalho ${ativo ? "ativo" : ""} ${!n && !ativo ? "vazio" : ""}" data-modulo="${id}" title="${esc(id ? nomeModulo(id) : "Todos os módulos")}">
      <span class="q">${icone}</span><span class="n">${n}</span><span class="nome">${nome}</span>
    </button>`;
  }).join("");
}

function itemVideo(v) {
  return `<button class="item" data-video="${v.id}">
    <span class="play">${PLAY}</span>
    <span><span class="t">${esc(v.titulo)}</span>
    <span class="meta">${v.tipos.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${v.blocos.length ? "" : `<span class="tag">sem narração</span>`}</span></span>
  </button>`;
}

function desenhar() {
  const ts = termos(estado.q);
  $("#limpar").style.display = estado.q ? "block" : "none";
  const el = $("#conteudo");

  if (!dados.videos.length) {
    desenharFiltros([]);
    el.innerHTML = `<section class="secao"><div class="aguardando">
      <div class="ico">${ICONES.todos}</div>
      <h2>Conteúdo do ${esc(SISTEMA.nome.replace("Consulta ", ""))} em preparação</h2>
      <p>Esta área já está pronta: assim que as transcrições forem adicionadas na pasta ${esc(SISTEMA.pasta)}, os vídeos aparecem aqui organizados por módulo, com a mesma busca.</p>
    </div></section>`;
    return;
  }

  if (!ts.length) {
    desenharFiltros(dados.videos);
    const visiveis = dados.videos.filter((v) => passa(v));
    let h = "";
    for (const [id] of ATALHOS.slice(1)) {
      const m = dados.modulos.find((x) => x.id === id);
      const vs = visiveis.filter((v) => v.modulo === id);
      if (!m || !vs.length) continue;
      h += `<section class="secao"><h2>${esc(m.nome)}</h2><p class="desc">${vs.length} ${vs.length === 1 ? "vídeo" : "vídeos"} · ${esc(m.descricao)}</p><div class="lista">${vs.map(itemVideo).join("")}</div></section>`;
    }
    el.innerHTML = h || `<div class="secao"><p class="vazio-msg">Nenhum vídeo com esses filtros.</p></div>`;
    return;
  }

  const todos = buscar(ts);
  desenharFiltros(todos.map((r) => r.v));
  const res = todos.filter((r) => passa(r.v));
  let h = `<section class="secao"><h2>${res.length} ${res.length === 1 ? "vídeo encontrado" : "vídeos encontrados"} para “${esc(estado.q.trim())}”</h2><p class="desc">${estado.modulo ? "No módulo " + esc(nomeModulo(estado.modulo)) + ". " : ""}Clique na minutagem para abrir o vídeo no trecho.</p>`;
  if (!res.length) {
    el.innerHTML = h + `<p class="vazio-msg">Nada encontrado. Tente outra palavra ou menos termos.</p></section>`;
    return;
  }
  h += res.slice(0, 80).map(({ v, blocos }) => {
    const trechos = blocos.slice(0, 3).map(({ i }) => {
      const b = v.blocos[i];
      return `<div class="trecho"><button class="tempo" data-video="${v.id}" data-seg="${b.seg}">${b.tempo}</button><span>${destacar(recorte(b.texto, ts), ts)}</span></div>`;
    }).join("");
    const resto = blocos.length > 3 ? `<div class="mais">+ ${blocos.length - 3} trecho(s) neste vídeo</div>` : "";
    return `<article class="resultado">
      <button class="t" data-video="${v.id}">${destacar(v.titulo, ts)}</button>
      <div class="meta"><span class="tag mod">${esc(nomeModulo(v.modulo))}</span>${v.tipos.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${trechos}${resto}
    </article>`;
  }).join("");
  el.innerHTML = h + "</section>";
}

// ---------- vídeo aberto
let atual = null;
function abrir(id, seg) {
  const v = dados.videos.find((x) => x.id === id);
  if (!v) return;
  atual = v;
  $("#dlg-titulo").textContent = v.titulo;
  $("#dlg-meta").innerHTML = `<span class="tag">${esc(nomeModulo(v.modulo))}</span>` + v.tipos.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  $("#yt").href = v.url;
  $("#q-local").value = "";
  tocar(seg || 0, seg != null);
  desenharTranscricao(termos(estado.q));
  if (!$("#dlg").open) $("#dlg").showModal();
  marcarBloco(seg);
}

function tocar(seg, auto) {
  $("#iframe").src = `https://www.youtube-nocookie.com/embed/${atual.id}?start=${Math.floor(seg)}&rel=0${auto ? "&autoplay=1" : ""}`;
}

function desenharTranscricao(ts) {
  $("#transcricao").innerHTML = atual.blocos.map((b, i) =>
    `<div class="bloco" data-i="${i}"><button class="tempo" data-seg="${b.seg}">${b.tempo}</button><span>${destacar(b.texto, ts)}</span></div>`
  ).join("") || `<p class="vazio-msg">Este vídeo não tem narração: só mostra as telas do sistema com música.<br>Assista pelo player ao lado.</p>`;
}

function marcarBloco(seg) {
  document.querySelectorAll(".bloco.foco").forEach((b) => b.classList.remove("foco"));
  if (seg == null) return $("#transcricao").scrollTo(0, 0);
  const i = atual.blocos.findIndex((b) => b.seg === Number(seg));
  const el = document.querySelector(`.bloco[data-i="${i}"]`);
  if (el) { el.classList.add("foco"); el.scrollIntoView({ block: "center" }); }
}

// ---------- eventos
let timer;
$("#q").addEventListener("input", (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => { estado.q = e.target.value; desenhar(); }, 120);
});
$("#limpar").addEventListener("click", () => { $("#q").value = ""; estado.q = ""; desenhar(); $("#q").focus(); });
$("#cards").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tipo]");
  if (b) { estado.tipo = estado.tipo === b.dataset.tipo ? "" : b.dataset.tipo; desenhar(); }
});
$("#atalhos").addEventListener("click", (e) => {
  const b = e.target.closest("[data-modulo]");
  if (b) { estado.modulo = estado.modulo === b.dataset.modulo ? "" : b.dataset.modulo; desenhar(); }
});
$("#conteudo").addEventListener("click", (e) => {
  const b = e.target.closest("[data-video]");
  if (b) abrir(b.dataset.video, b.dataset.seg != null ? Number(b.dataset.seg) : undefined);
});
$("#transcricao").addEventListener("click", (e) => {
  const b = e.target.closest(".tempo");
  if (!b) return;
  tocar(Number(b.dataset.seg), true);
  marcarBloco(Number(b.dataset.seg));
});
$("#q-local").addEventListener("input", (e) => {
  const ts = termos(e.target.value);
  desenharTranscricao(ts.length ? ts : termos(estado.q));
  if (ts.length) document.querySelectorAll(".bloco").forEach((el) => {
    el.classList.toggle("oculto", !ts.every((t) => atual._blocos[el.dataset.i].includes(t)));
  });
});
$("#fechar").addEventListener("click", () => $("#dlg").close());
$("#dlg").addEventListener("click", (e) => { if (e.target === $("#dlg")) $("#dlg").close(); });
$("#dlg").addEventListener("close", () => { $("#iframe").src = "about:blank"; });
$("#recarregar").addEventListener("click", carregar);
$("#tema").addEventListener("click", () => {
  const atualEscuro = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() === "#15171b";
  const novo = atualEscuro ? "claro" : "escuro";
  document.documentElement.dataset.tema = novo;
  try { localStorage.setItem("tema", novo); } catch (e) {}
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); $("#q").focus(); }
});

// ---------- troca de sistema (clique no nome do site)
$("#nome-site").addEventListener("click", (e) => {
  e.stopPropagation();
  const aberto = $("#menu-sistemas").classList.toggle("aberto");
  $("#nome-site").setAttribute("aria-expanded", aberto);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sistemas")) { $("#menu-sistemas").classList.remove("aberto"); $("#nome-site").setAttribute("aria-expanded", false); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#menu-sistemas").classList.remove("aberto"); });

$("#q").placeholder = SISTEMA.exemplo;
$("#recarregar").title = `Recarregar o conteúdo da pasta ${SISTEMA.pasta}`;

function carregar() {
  fetch(SISTEMA.dados, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : r.status === 404 ? { modulos: [], videos: [] } : r.text().then((t) => Promise.reject(new Error(t)))))
    .then((d) => { dados = d; preparar(); desenhar(); })
    .catch((e) => { $("#conteudo").innerHTML = `<div class="secao"><p class="vazio-msg">Não consegui ler as transcrições.<br>${esc(e.message)}</p></div>`; });
}
carregar();
