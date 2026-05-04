const express = require('express');
const cors = require('cors');
const path = require('path');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');
const google = require('./services/google');

const app = express();

app.use(cors());
app.use(express.json());

// frontend
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/* =========================
   🔎 SEARCH INTELIGENTE
========================= */
app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const results = await Promise.allSettled([
      ml.search(q),
      olx.search(q),
      amazon.search(q),
      google.search(q)
    ]);

    let data = [];

    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        data = data.concat(r.value);
      }
    }

    // 🔥 NORMALIZAÇÃO FORTE (EVITA SUMIR DADOS)
    const final = data
      .filter(p => p && p.title)
      .map(p => ({
        title: p.title || "Sem título",
        price: Number(p.price),
        image: p.image && p.image.trim() !== ""
          ? p.image
          : "https://via.placeholder.com/300?text=Sem+Imagem",

        link: (p.link && p.link.startsWith("http"))
          ? p.link
          : "",

        source: p.source || "Loja"
      }))
      .filter(p => p.title.length > 3);

    // 🔥 fallback se tudo falhar
    if (final.length === 0) {
      return res.json([
        {
          title: q,
          price: 0,
          image: "https://via.placeholder.com/300?text=Sem+Resultados",
          link: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
          source: "Google Fallback"
        }
      ]);
    }

    return res.json(final);

  } catch (err) {
    console.error("SEARCH ERROR:", err);

    return res.json([
      {
        title: q,
        price: 0,
        image: "https://via.placeholder.com/300?text=Erro+na+Busca",
        link: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        source: "Fallback"
      }
    ]);
  }
});

/* =========================
   🚀 SERVER START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
