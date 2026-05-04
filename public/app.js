const API_URL = "/search";

let resultados = [];

async function buscar() {
  const q = document.getElementById("busca").value;
  if (!q) return;

  const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}&t=${Date.now()}`);
  const data = await res.json();

  resultados = Array.isArray(data) ? data : [];

  renderizar(resultados);
}

function gerarLink(item) {
  // 🔥 se tem link válido usa ele
  if (item.link && item.link.startsWith("http")) {
    return item.link;
  }

  // 🔥 fallback por loja (IMPORTANTE)
  if (item.source === "Amazon") {
    return `https://www.amazon.com.br/s?k=${encodeURIComponent(item.title)}`;
  }

  if (item.source === "Mercado Livre") {
    return `https://lista.mercadolivre.com.br/${encodeURIComponent(item.title)}`;
  }

  if (item.source === "OLX") {
    return `https://www.olx.com.br/brasil?q=${encodeURIComponent(item.title)}`;
  }

  // fallback geral
  return `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;
}

function renderizar(data) {
  const grid = document.getElementById("grid");
  const melhorDiv = document.getElementById("melhor");

  grid.innerHTML = "";
  melhorDiv.innerHTML = "";

  if (!data.length) {
    grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
    return;
  }

  const melhor = [...data].sort((a,b) => (a.price||0) - (b.price||0))[0];

  const linkMelhor = gerarLink(melhor);

  melhorDiv.innerHTML = `
    <div class="melhor-card">
      <h2>🔥 Melhor oferta</h2>
      <img src="${melhor.image || ''}">
      <p>${melhor.title}</p>
      <p class="price">R$ ${melhor.price}</p>
      <small>${melhor.source}</small><br>

      <a class="button" href="${linkMelhor}" target="_blank">
        Ver oferta
      </a>
    </div>
  `;

  data.forEach(p => {

    const link = gerarLink(p);

    grid.innerHTML += `
      <div class="card">
        <img src="${p.image || ''}">
        <div class="title">${p.title}</div>
        <div class="price">R$ ${p.price}</div>
        <small>${p.source}</small><br>

        <a class="button" href="${link}" target="_blank">
          Ver produto
        </a>
      </div>
    `;
  });
}

document.addEventListener("input", () => {
  if (!resultados.length) return;

  const min = Number(document.getElementById("min").value) || 0;
  const max = Number(document.getElementById("max").value) || 999999;

  const filtrado = resultados.filter(p =>
    (p.price || 0) >= min && (p.price || 0) <= max
  );

  renderizar(filtrado);
});
