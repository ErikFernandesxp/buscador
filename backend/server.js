const express = require('express');
const cors = require('cors');
const path = require('path');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');

const app = express(); // 🔥 TEM QUE SER A PRIMEIRA COISA DO APP

app.use(cors());
app.use(express.json());

// 🔥 serve o frontend
app.use(express.static(path.join(__dirname, '../public')));

// 🔥 rota principal do site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/* =========================
   🔎 SEARCH INTELIGENTE
========================= */
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

        // 🔥 sistema de relevância simples
        let score = 0;

        words.forEach(w => {
          if (title.includes(w)) score += 2;
        });

        return {
          title: p.title,
          price: Number(p.price) || 0,
          image: p.image || "",
          link: p.link || "",
          source: p.source || "Loja",
          score
        };
      })
      .filter(p => p.score > 0) // remove irrelevantes
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
    console.error("Erro search:", err);
    return res.json([]);
  }
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
