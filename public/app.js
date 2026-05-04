const API_URL = "/search";

let resultados = [];

async function buscar() {
    const input = document.getElementById("busca");
    const q = input ? input.value : "";

    if (!q) return;

    try {
        const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}`);

        resultados = await res.json();

        console.log("RESULTADOS:", resultados);

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

    if (!data || data.length === 0) {
        grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
        return;
    }

    const melhor = data[0];

    melhorDiv.innerHTML = `
        <div class="melhor-card">
            <h2>🔥 Melhor oferta</h2>
            <img src="${melhor.image || ''}">
            <p>${melhor.title}</p>
            <p class="price">R$ ${melhor.price}</p>
            <a class="button" href="${melhor.link || '#'}" target="_blank">Comprar</a>
        </div>
    `;

    data.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.image || ''}">
                <div class="title">${p.title}</div>
                <div class="price">R$ ${p.price}</div>
                <small>${p.source || ''}</small><br>
                <a class="button" href="${p.link || '#'}" target="_blank">Ver produto</a>
            </div>
        `;
    });
}

/* FILTRO SEGURO */
document.addEventListener("input", () => {
    if (!resultados || resultados.length === 0) return;

    const min = Number(document.getElementById("min")?.value) || 0;
    const max = Number(document.getElementById("max")?.value) || 999999;

    const filtrado = resultados.filter(p => {
        const price = Number(p.price) || 0;
        return price >= min && price <= max;
    });

    renderizar(filtrado);
});
