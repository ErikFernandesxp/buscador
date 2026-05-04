const axios = require('axios');
const cheerio = require('cheerio');

exports.search = async (q) => {
  const url = `https://www.amazon.com.br/s?k=${q}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  let items = [];

  $('.s-result-item').each((i, el) => {
    const title = $(el).find('h2 span').text();
    const priceText = $(el).find('.a-price-whole').text();
    const price = parseFloat(priceText.replace(/[^\d]/g, ''));

    if (title && price) {
      items.push({ title, price, source: "Amazon" });
    }
  });

  return items.slice(0, 10);
};