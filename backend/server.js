const express = require('express');
const cors = require('cors');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');
const ai = require('./services/ai');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// 🔥 ROTA PRINCIPAL (corrige "Cannot GET /")
app.get('/', (req, res) => {
  res.json({
    status: "online",
    message: "API do Buscador funcionando",
    endpoints: {
      search: "/search?q=produto"
    }
  });
});

// 🔎 ROTA DE BUSCA
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

    return res.json(agrupado);

  } catch (err) {
    console.error("Erro na busca:", err);
    return res.json([]);
  }
});

// 🚀 PORTA DO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
