app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const query = q.toLowerCase().trim();
  const words = query.split(" ").filter(Boolean);

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

    const final = data
      .filter(p => p && p.title)
      .map(p => {
        const title = (p.title || "").toLowerCase();

        let score = 0;

        words.forEach(w => {
          if (title.includes(w)) score += 3;
        });

        if (!title.includes(words[0] || "")) score -= 2;

        return {
          title: p.title,
          price: parseFloat(p.price) || 0,
          image: p.image || "",
          link: p.link || "",
          source: p.source || "Loja",
          score
        };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score || a.price - b.price)
      .map(p => ({
        title: p.title,
        price: p.price,
        image: p.image,
        link: p.link,
        source: p.source
      }));

    return res.json(final);

  } catch (err) {
    console.error(err);
    return res.json([]);
  }
});
