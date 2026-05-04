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
    const melhor = g.items.sort((a, b) =>
      (Number(a.price) || 999999) - (Number(b.price) || 999999)
    )[0];

    return {
      title: melhor.title || "",
      price: Number(melhor.price) || 0,
      image: melhor.image || "",
      link: melhor.link || "",
      source: melhor.source || ""
    };
  });
}

module.exports = { agrupar };
