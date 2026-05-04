app.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  try {
    const [mlData, olxData, amazonData] = await Promise.all([
      ml.search(q).catch(() => []),
      olx.search(q).catch(() => []),
      amazon.search(q).catch(() => [])
    ]);

    let data = [
      ...(mlData || []),
      ...(olxData || []),
      ...(amazonData || [])
    ];

    console.log("DEBUG TOTAL:", data.length);

    // 🔥 SE NADA VIER, NÃO QUEBRA
    if (!data.length) {
      return res.json([]);
    }

    const agrupado = ai.agrupar(data || []);

    const final = agrupado.map(item => ({
      title: item.title || "",
      price: Number(item.price) || 0,
      source: item.source || "",

      image: item.image && item.image !== ""
        ? item.image
        : gerarImagem(item.title || "produto"),

      link: item.link || "#"
    }));

    return res.json(final);

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return res.json([]);
  }
});
