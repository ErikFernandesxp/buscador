const axios = require('axios');

exports.search = async (q) => {
  try {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${q}`;
    const res = await axios.get(url);

    return res.data.results.slice(0, 10).map(i => ({
      title: i.title,
      price: i.price,
      image: i.thumbnail?.replace('-I.jpg', '-O.jpg') || "",
      link: i.permalink,
      source: "Mercado Livre"
    }));

  } catch (err) {
    return [];
  }
};
