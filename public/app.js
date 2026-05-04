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

function gerarLinkSeguro(item) {
  // 🔥 prioridade: link real
  if (item.link && item.link.startsWith("http")) {
    return item.link;
  }

  // 🔥 fallback inteligente
  return `https://www.google.com/search?q=${encodeURIComponent(item.title || "")}`;
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

  const melhor = [...data].sort((a, b) => (a.price || 0) - (b.price || 0))[0];

  const linkMelhor = gerarLinkSeguro(melhor);

  melhorDiv.innerHTML = `
    <div class="melhor-card">
      <h2>🔥 Melhor oferta</h2>
      <img src="${melhor.image || ''}">
      <p>${melhor.title}</p>
      <p class="price">R$ ${melhor.price}</p>
      <small>${melhor.source || ''}</small><br>

      <a class="button" href="${linkMelhor}" target="_blank" rel="noopener noreferrer">
        Ver oferta
      </a>
    </div>
  `;

  data.forEach(p => {

    const link = gerarLinkSeguro(p);

    grid.innerHTML += `
      <div class="card">
        <img src="${p.image || ''}">
        <div class="title">${p.title}</div>
        <div class="price">R$ ${p.price}</div>
        <small>${p.source || ''}</small><br>

        <a class="button" href="${link}" target="_blank" rel="noopener noreferrer">
          Ver produto
        </a>
      </div>
    `;
  });
}

/* filtro de preço */
document.addEventListener("input", () => {
  if (!resultados.length) return;

  const min = Number(document.getElementById("min").value) || 0;
  const max = Number(document.getElementById("max").value) || 999999;

  const filtrado = resultados.filter(p =>
    (p.price || 0) >= min && (p.price || 0) <= max
  );

  renderizar(filtrado);
});
