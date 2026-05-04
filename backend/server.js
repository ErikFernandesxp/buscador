const express = require('express');
const cors = require('cors');
const path = require('path');

const ml = require('./services/mercadolivre');
const olx = require('./services/olx');
const amazon = require('./services/amazon');
const ai = require('./services/ai');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/* =========================
   IMAGEM FALLBACK
========================= */
function gerarImagem(title) {
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(title)}`;
}

/* =========================
   SEARCH (ROBUSTO)
========================= */
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

    console.log("TOTAL RAW:", data.length);

    if (!data.length) {
      return res.json([]);
    }

    const agrupado = ai.agrupar(data);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
