exports.search = async (q) => {
  return [
    {
      title: `${q} - resultados no Google Shopping`,
      price: 0,
      image: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png",
      link: `https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=shop`,
      source: "Google"
    }
  ];
};
