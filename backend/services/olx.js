const axios = require('axios');
const cheerio = require('cheerio');

exports.search = async (q) => {
  try {
    const url = `https://www.olx.com.br/brasil?q=${q}`;

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    let items = [];

    $('li').each((i, el) => {

      const title = $(el).find('h2').text();
      const priceText = $(el).find('span').first().text();

      const price = Number(priceText.replace(/[^\d]/g, ''));

      const image = $(el).find('img').attr('src');

      if (title && price) {
        items.push({
          title,
          price: isNaN(price) ? 0 : price,
          image: image || "",
          link: `https://www.olx.com.br/brasil?q=${encodeURIComponent(title)}`,
          source: "OLX"
        });
      }
    });

    return items.slice(0, 10);

  } catch (err) {
    return [];
  }
};
