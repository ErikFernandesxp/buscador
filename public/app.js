const API_URL = "/search";

let resultados = [];

async function buscar() {
  const q = document.getElementById("busca").value;
  if (!q) return;

  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}&t=${Date.now()}`);
    const data = await res.json();

    if (Array.isArray(data) && data.length) {
      resultados = data;
    } else {
      resultados = [];
    }

    renderizar(resultados);

  } catch (err) {
    console.error("Erro busca:", err);
    resultados = [];
    renderizar([]);
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
  const melhor = [...data].sort((a, b) => (a.price || 0) - (b.price || 0))[0];

  const linkMelhor = (melhor.link && melhor.link.startsWith("http"))
    ? melhor.link
    : null;

  melhorDiv.innerHTML = `
    <div class="melhor-card">
      <h2>🔥 Melhor oferta</h2>
      <img src="${melhor.image || ''}">
      <p>${melhor.title}</p>
      <p class="price">R$ ${melhor.price}</p>
      <small>${melhor.source || ''}</small><br>

      ${
        linkMelhor
          ? `<a class="button" href="${linkMelhor}" target="_blank" rel="noopener noreferrer">Comprar</a>`
          : `<span>Sem link disponível</span>`
      }
    </div>
  `;

  data.forEach(p => {

    const link = (p.link && p.link.startsWith("http")) ? p.link : null;

    grid.innerHTML += `
      <div class="card">
        <img src="${p.image || ''}">
        <div class="title">${p.title}</div>
        <div class="price">R$ ${p.price}</div>
        <small>${p.source || ''}</small><br>

        ${
          link
            ? `<a class="button" href="${link}" target="_blank" rel="noopener noreferrer">Ver produto</a>`
            : `<span style="color:#999">Sem link</span>`
        }
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
