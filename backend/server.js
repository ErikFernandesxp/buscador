const express = require('express');
const cors = require('cors');
const path = require('path');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

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

    // 🔥 padronização final segura
    const final = data
      .filter(p => p && p.title)
      .map(p => ({
        title: p.title || "",
        price: Number(p.price) || 0,
        image: p.image || "",
        link: p.link || "",
        source: p.source || "Loja"
      }));

    return res.json(final);

  } catch (err) {
    console.error(err);
    return res.json([]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));
