const express = require('express');
const cors = require('cors');
const path = require('path');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');
const ai = require('./services/ai');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

/* =========================
   🔥 FRONTEND (public)
========================= */
app.use(express.static(path.join(__dirname, 'public')));

// garante abertura do index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   🔎 API SEARCH
========================= */
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

    // filtro seguro
    data = data.filter(i =>
      i && i.title && i.price !== undefined && i.price !== null
    );

    const agrupado = ai.agrupar(data);

    return res.json(agrupado);

  } catch (err) {
    console.error("Erro search:", err);
    return res.json([]);
  }
});

/* =========================
   🚀 PORT (RENDER)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
