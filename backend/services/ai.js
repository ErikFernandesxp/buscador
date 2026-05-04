const similarity = require('string-similarity');

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function agrupar(produtos) {
  const grupos = [];

  produtos.forEach(p => {
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
    const melhor = g.items.sort((a,b) => a.price - b.price)[0];

    return {
      title: melhor.title,   // 🔥 CORRIGIDO
      price: melhor.price,   // 🔥 CORRIGIDO
      link: melhor.link,
      image: melhor.image || "",
      source: melhor.source
    };
  });
}

module.exports = { agrupar };