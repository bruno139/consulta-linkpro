// Regras que distribuem cada vídeo em um módulo.
// A ordem importa: o vídeo entra no PRIMEIRO módulo cuja regra casar com o título.
// Para mudar um vídeo de módulo, ajuste a expressão (o título é comparado sem acentos e em minúsculas).
module.exports = [
  {
    id: "versoes",
    nome: "Versões e Novidades",
    descricao: "Histórico de versões do Link, novidades dos sistemas e lançamentos.",
    regra: /historico da versao|novidades|lancamento/,
  },
  {
    id: "apps",
    nome: "Apps e Sistemas Auxiliares",
    descricao: "Navi Vendas, Link Móvel, Link Web, Link Garçom, Autoatendimento, Balanço Estoque e demonstrações gerais.",
    regra: /^navi vendas|link movel|link web|link garcom|autoatendimento|balanco estoque|demonstracao do sistema/,
  },
  {
    id: "produtos",
    nome: "Cadastro de Produtos",
    descricao: "Abas do cadastro, combos, multissabor, variações, grupos, marcas e unidades.",
    regra: /cadastro de produtos|produto (tipo|composto|de balanca)|clonar um produto|unidade de medida|uma marca|variacoes|informacoes de varios produtos|importacao de produtos|plataforma|grupo e sub|complementos|precos dos produtos/,
  },
  {
    id: "financeiro",
    nome: "Financeiro",
    descricao: "Contas a pagar e receber, boletos, cartões, condições de pagamento, juros e comissões.",
    regra: /comissao|financeiro|boleto|conta bancaria|contas (a pagar|automaticas)|juros|configuracao de cartao|cartao fidelidade|condicao de pagamento|condicoes de pagamento|credito para o cliente|extrato|pagamento integrado|ordem de pagamento|recebimento\/pagamento|recebimento parcial/,
  },
  {
    id: "restaurante",
    nome: "Bares, Restaurantes e Delivery",
    descricao: "Atendimento, mesas e comandas, cozinha, delivery, iFood, Catálogo Online e Menu Digital.",
    regra: /ifood|catalogo|menu digital|delivery|entregador|cozinha|mesa|comanda|bares|atendimento|pontos de impressao|estacao responsavel/,
  },
  {
    id: "fiscal",
    nome: "Fiscal e Notas",
    descricao: "NF-e, NFC-e, NFS-e, MDF-e, SPED, certificado digital, XML e tributação.",
    regra: /fiscal|fiscais|\bnf-?e\b|\bnfc-?e|\bnfs-?e|sped|mdf|certificado|notas? pendentes|carta de correcao|xml|df-e|tributacao|condutor|veiculo|cpf ou cnpj/,
  },
  {
    id: "estoque",
    nome: "Estoque e Compras",
    descricao: "Entrada, ajuste e contagem de estoque, inventário, lotes, fornecedores e compras.",
    regra: /estoque|inventario|compra|fornecedor|lote|contagem|custos/,
  },
  {
    id: "vendas",
    nome: "Caixa e Vendas",
    descricao: "Vendas no caixa, descontos, trocas, devoluções, sangria, Pix, orçamentos e negociação.",
    regra: /caixa|venda|desconto|troca|devolu|sangria|suprimento|pix|vale|orcamento|negocia|cpf|promoc|ticket|cliente|fidelidade|condiciona/,
  },
  {
    id: "equipamentos",
    nome: "Etiquetas, Balanças e Integrações",
    descricao: "Etiquetas, balanças, consulta de preço, pesagem automática e integração com Tray.",
    regra: /etiqueta|balanca|consulta preco|pesagem|tray/,
  },
  {
    id: "sistema",
    nome: "Configurações e Sistema",
    descricao: "Instalação, usuários, multilojas, ordem de serviço, backup e importador.",
    regra: /.*/,
  },
];
