const axios = require('axios');

exports.search = async (q) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${q}`;
  const res = await axios.get(url);

  return res.data.results.slice(0, 20).map(i => ({
    title: i.title,
    price: i.price,
    image: i.thumbnail.replace('-I.jpg','-O.jpg'), // 🔥 imagem maior
    link: i.permalink,
    source: "Mercado Livre"
  }));
};