const axios = require('axios');
const cheerio = require('cheerio');

exports.search = async (q) => {
  const url = `https://www.olx.com.br/brasil?q=${q}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  let items = [];

  $('li').each((i, el) => {
    const title = $(el).find('h2').text();
    const priceText = $(el).find('span').first().text();
    const price = parseFloat(priceText.replace(/[^\d]/g, ''));

    const image = $(el).find('img').attr('src');

    const link = "https://www.olx.com.br";

    if (title && price) {
      items.push({ title, price, image, link, source: "OLX" });
    }
  });

  return items.slice(0, 10);
};
