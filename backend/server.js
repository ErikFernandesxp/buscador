const express = require('express');
const cors = require('cors');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');
const ai = require('./services/ai');

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

// 🌐 SERVIR FRONTEND (IMPORTANTE PARA VISUAL)
app.use(express.static('public'));

// 🟢 HOME
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 🔎 SEARCH
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

    return res.json(agrupado);

  } catch (err) {
    console.error(err);
    return res.json([]);
  }
});

// 🚀 PORTA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
