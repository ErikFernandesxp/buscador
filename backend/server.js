const express = require('express');
const cors = require('cors');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');
const ai = require('./services/ai');

const app = express();
app.use(cors());

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
      if (r.status === "fulfilled") {
        data = data.concat(r.value);
      }
    });

    data = data.filter(i => i.price && i.title);

    const agrupado = ai.agrupar(data);

    res.json(agrupado);

  } catch (err) {
    res.json([]);
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));