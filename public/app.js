const API_URL = "/search";

let resultados = [];

async function buscar() {
    const q = document.getElementById("busca").value;

    if (!q) return;

    const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}`);
    resultados = await res.json();

    renderizar(resultados);
}

function renderizar(data) {
    const grid = document.getElementById("grid");
    const melhorDiv = document.getElementById("melhor");

    grid.innerHTML = "";
    melhorDiv.innerHTML = "";

    if (!data || data.length === 0) {
        grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
        return;
    }

    const melhor = data[0];

    melhorDiv.innerHTML = `
        <div class="melhor-card">
            <h2>🔥 Melhor oferta</h2>
            <img src="${melhor.image}" width="200">
            <p>${melhor.title}</p>
            <p class="price">R$ ${melhor.price}</p>
            <a class="button" href="${melhor.link}" target="_blank">Comprar</a>
        </div>
    `;

    data.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.image}">
                <div class="title">${p.title}</div>
                <div class="price">R$ ${p.price}</div>
                <small>${p.source || ''}</small><br>
                <a class="button" href="${p.link}" target="_blank">Ver produto</a>
            </div>
        `;
    });
}

document.addEventListener("input", () => {
    const min = Number(document.getElementById("min").value) || 0;
    const max = Number(document.getElementById("max").value) || 999999;

    const filtrado = resultados.filter(p => p.price >= min && p.price <= max);

    renderizar(filtrado);
});
