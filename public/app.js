const API_URL = "/search";

let resultados = [];

async function buscar() {
  const q = document.getElementById("busca").value;

  if (!q) return;

  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}&t=${Date.now()}`);
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      resultados = data;
    }

    renderizar(resultados);

  } catch (err) {
    console.error("Erro busca:", err);
  }
}

function renderizar(data) {
  const grid = document.getElementById("grid");
  const melhorDiv = document.getElementById("melhor");

  grid.innerHTML = "";
  melhorDiv.innerHTML = "";

  if (!data || !data.length) {
    grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
    return;
  }

  // 🔥 melhor preço
  const melhor = [...data].sort((a,b) => a.price - b.price)[0];

  melhorDiv.innerHTML = `
    <div class="melhor-card">
      <h2>🔥 Melhor oferta</h2>
      <img src="${melhor.image || ''}">
      <p>${melhor.title}</p>
      <p class="price">R$ ${melhor.price}</p>
      <small>${melhor.source}</small><br>
      <a class="button" href="${melhor.link}" target="_blank">Comprar</a>
    </div>
  `;

  data.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image || ''}">
        <div class="title">${p.title}</div>
        <div class="price">R$ ${p.price}</div>
        <small>${p.source}</small><br>
        <a class="button" href="${p.link}" target="_blank">Ver produto</a>
      </div>
    `;
  });
}

/* filtro seguro */
document.addEventListener("input", () => {
  if (!resultados.length) return;

  const min = Number(document.getElementById("min").value) || 0;
  const max = Number(document.getElementById("max").value) || 999999;

  const filtrado = resultados.filter(p => {
    const price = Number(p.price) || 0;
    return price >= min && price <= max;
  });

  renderizar(filtrado);
});
