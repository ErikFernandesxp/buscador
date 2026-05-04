const axios = require('axios');
const cheerio = require('cheerio');

exports.search = async (q) => {
  try {
    const url = `https://www.amazon.com.br/s?k=${q}`;

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    let items = [];

    $('.s-result-item').each((i, el) => {

      const title = $(el).find('h2 span').text();

      const priceText = $(el).find('.a-price-whole').text();

      const price = Number(
        priceText.replace(/[^\d]/g, '')
      );

      const image = $(el).find('img').attr('src');

      const href = $(el).find('h2 a').attr('href');

      const link = href
        ? `https://www.amazon.com.br${href}`
        : "";

      if (title && price) {
        items.push({
          title,
          price: isNaN(price) ? 0 : price,
          image: image || "",
          link,
          source: "Amazon"
        });
      }
    });

    return items.slice(0, 10);

  } catch (err) {
    return [];
  }
};
