const API_URL = "/search";

let resultados = [];

async function buscar() {
  const q = document.getElementById("busca").value;
  if (!q) return;

  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}&t=${Date.now()}`);
    const data = await res.json();

    resultados = Array.isArray(data) ? data : [];

    renderizar(resultados);

  } catch (err) {
    console.error("Erro busca:", err);
    resultados = [];
    renderizar([]);
  }
}

function gerarLink(item) {
  if (item.link && typeof item.link === "string" && item.link.startsWith("http")) {
    return item.link;
  }

  const title = encodeURIComponent(item.title || "");

  if (item.source === "Amazon") {
    return `https://www.amazon.com.br/s?k=${title}`;
  }

  if (item.source === "Mercado Livre") {
    return `https://lista.mercadolivre.com.br/${title}`;
  }

  if (item.source === "OLX") {
    return `https://www.olx.com.br/brasil?q=${title}`;
  }

  return `https://www.google.com/search?q=${title}`;
}

function renderizar(data) {
  const grid = document.getElementById("grid");
  const melhorDiv = document.getElementById("melhor");

  grid.innerHTML = "";
  melhorDiv.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
    return;
  }

  // 🔥 garante preço válido
  const ordenado = [...data]
    .map(p => ({
      ...p,
      price: Number(p.price) || 0
    }))
    .filter(p => p.price >= 0);

  const melhor = ordenado.sort((a, b) => a.price - b.price)[0];

  const linkMelhor = gerarLink(melhor);

  melhorDiv.innerHTML = `
    <div class="melhor-card">
      <h2>🔥 Melhor oferta</h2>
      <img src="${melhor.image || ''}">
      <p>${melhor.title}</p>
      <p class="price">R$ ${melhor.price.toFixed(2)}</p>
      <small>${melhor.source || ''}</small><br>

      <a class="button" href="${linkMelhor}" target="_blank" rel="noopener noreferrer">
        Ver oferta
      </a>
    </div>
  `;

  ordenado.forEach(p => {
    const link = gerarLink(p);

    grid.innerHTML += `
      <div class="card">
        <img src="${p.image || ''}">
        <div class="title">${p.title}</div>
        <div class="price">R$ ${p.price.toFixed(2)}</div>
        <small>${p.source || ''}</small><br>

        <a class="button" href="${link}" target="_blank" rel="noopener noreferrer">
          Ver produto
        </a>
      </div>
    `;
  });
}

/* 🔥 FILTRO DE PREÇO 100% SEGURO */
document.addEventListener("input", () => {
  if (!resultados.length) return;

  const minInput = document.getElementById("min").value;
  const maxInput = document.getElementById("max").value;

  const min = minInput === "" ? 0 : Number(minInput);
  const max = maxInput === "" ? 999999 : Number(maxInput);

  const filtrado = resultados
    .map(p => ({
      ...p,
      price: Number(p.price) || 0
    }))
    .filter(p => {
      if (!isFinite(p.price)) return false;
      return p.price >= min && p.price <= max;
    });

  renderizar(filtrado);
});
