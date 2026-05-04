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
    const lojas = g.items.map(p => ({
      title: p.title,
      price: Number(p.price) || 0,
      image: p.image || "",
      link: p.link || "",
      source: p.source || "Desconhecido"
    }));

    const melhor = lojas.sort((a, b) =>
      a.price - b.price
    )[0];

    return {
      title: melhor.title,
      price: melhor.price,
      image: melhor.image,
      link: melhor.link,
      source: melhor.source
    };
  });
}

module.exports = { agrupar };
