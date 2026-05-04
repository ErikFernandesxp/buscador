const similarity = require('string-similarity');

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function agrupar(produtos = []) {
  if (!Array.isArray(produtos)) return [];

  const grupos = [];

  produtos.forEach(p => {
    if (!p || !p.title) return;

    const nome = normalize(p.title);

    let grupo = grupos.find(g =>
      similarity.compareTwoStrings(g.nome, nome) > 0.6
    );

    if (grupo) {
      grupo.items.push(p);
    } else {
      grupos.push({ nome, items: [p] });
    }
  });

  return grupos.map(g => {
    const porLoja = {};

    g.items.forEach(p => {
      const loja = p.source || "Outros";

      if (!porLoja[loja]) {
        porLoja[loja] = p;
      } else {
        // mantém menor preço por loja
        if ((p.price || 999999) < (porLoja[loja].price || 999999)) {
          porLoja[loja] = p;
        }
      }
    });

    const lojas = Object.values(porLoja);

    const melhor = lojas.sort((a, b) =>
      (a.price || 999999) - (b.price || 999999)
    )[0];

    return {
      title: melhor.title,
      image: melhor.image || "",
      bestPrice: melhor.price,
      bestStore: melhor.source,

      link: melhor.link,

      comparison: lojas.map(l => ({
        store: l.source,
        price: l.price,
        link: l.link
      }))
    };
  });
}

module.exports = { agrupar };
