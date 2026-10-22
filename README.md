# Consulta Link PRO

Tela de consulta das transcrições dos vídeos do Link PRO (pasta `Área de Trabalho\Link_PRO\saida_link_pro`), organizadas por módulo e com busca.

## Rodar

Dê dois cliques em `iniciar.bat` ou, no terminal:

```bash
node server.js      # http://localhost:3001
```

Não precisa de `npm install`, só do Node. A pasta é lida a cada vez que a página abre, então novas transcrições aparecem sozinhas (basta recarregar).

- Outra porta: `set PORT=4000` antes de rodar.
- Outra pasta de transcrições: `set LINK_PRO_DIR=C:\caminho\saida_link_pro`.

## Versão publicada (link para colegas)

A pasta `docs/` é a versão publicada no GitHub Pages: a mesma tela, com os dados num arquivo `conteudo.json`.

- **Automático:** com o `iniciar.bat` aberto, toda mudança na pasta Link_PRO (editar, adicionar ou excluir) é publicada sozinha depois de ~15 segundos. O GitHub Pages leva mais ~1 minuto para mostrar.
- **Manual:** `node publicar.js` gera a pasta `docs/` e envia para o GitHub. `node publicar.js --so-gerar` só gera, sem enviar.
- Ao abrir, o app também publica o que mudou enquanto estava fechado.

## Como funciona

- **Tela inicial**: todos os vídeos agrupados por módulo, com filtros por módulo e por tipo (Tutorial, Treinamento, Cadastro de Produtos).
- **Busca**: ignora acentos e maiúsculas, procura no título e no texto falado, e mostra os trechos com a minutagem. Atalho: tecla `/`.
- **Vídeo**: abre o player já no trecho clicado, com a transcrição inteira ao lado e um filtro para buscar só dentro dele.
- **Módulos**: as regras estão em `modulos.js`. Para mudar um vídeo de módulo, ajuste a expressão (o primeiro módulo que casar com o título vence).
- Vídeos repetidos em mais de uma playlist aparecem uma vez só, com os dois tipos marcados.
