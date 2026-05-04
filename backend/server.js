app.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  try {
    const results = await Promise.allSettled([
      ml.search(q),
      olx.search(q),
      amazon.search(q)
    ]);

    let data = [];

    results.forEach(r => {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        data = data.concat(r.value);
      }
    });

    data = data.filter(i => i && i.title && i.price);

    const agrupado = ai.agrupar(data);

    // 🔥 PADRONIZA TUDO AQUI (ESSENCIAL)
    const final = agrupado.map(item => ({
      title: item.title,
      price: item.price,
      source: item.source || "",

      image: item.image || "https://via.placeholder.com/300x200?text=Sem+Imagem",

      link: item.link || item.url || "#"
    }));

    return res.json(final);

  } catch (err) {
    console.error(err);
    return res.json([]);
  }
});
