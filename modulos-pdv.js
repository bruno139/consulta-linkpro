// Regras que distribuem cada vídeo do PDV+ (Navi Vendas) em um módulo.
// Mesma lógica do modulos.js: o vídeo entra no PRIMEIRO módulo cuja regra casar com o título
// (comparado sem acentos e em minúsculas). Os ids batem com os atalhos da página pdv.html.
module.exports = [
  {
    id: "produtos",
    nome: "Produtos",
    descricao: "Cadastro de produtos, grupos e subgrupos e complementos.",
    regra: /cadastro automatico|grupos|complementos|produto/,
  },
  {
    id: "estoque",
    nome: "Estoque",
    descricao: "Entrada de nota fiscal, entrada manual e balanço de estoque.",
    regra: /estoque|nota fiscal/,
  },
  {
    id: "delivery",
    nome: "Delivery",
    descricao: "Pedidos de delivery, Catálogo Online, iFood e Conecta Entregador.",
    regra: /delivery|catalogo|ifood|entregador/,
  },
  {
    id: "apps",
    nome: "Apps",
    descricao: "Monitor de Cozinha, Pesagem Automática, Consulta Preço e Autoatendimento.",
    regra: /monitor de cozinha|pesagem|consulta preco|autoatendimento/,
  },
  {
    id: "clientes",
    nome: "Clientes",
    descricao: "Clientes e crediário.",
    regra: /cliente|crediario/,
  },
  {
    id: "caixa",
    nome: "Caixa",
    descricao: "Vendas no caixa, Pix e formas de pagamento.",
    regra: /venda|pix|caixa|pagamento/,
  },
  {
    id: "relatorios",
    nome: "Relatórios",
    descricao: "Relatórios do sistema.",
    regra: /relatorio/,
  },
  {
    id: "config",
    nome: "Configurações",
    descricao: "Configurações gerais do sistema.",
    regra: /.*/,
  },
];
