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

    if (!data.length) {
        grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
        return;
    }

    const melhor = data[0];

    // 🔥 destaque principal
    melhorDiv.innerHTML = `
        <div class="melhor-card">
            <h2>🔥 Melhor oferta</h2>
            <img src="${melhor.image || ''}">
            <p>${melhor.title}</p>
            <p class="price">R$ ${melhor.bestPrice}</p>
            <small>Melhor loja: ${melhor.bestStore}</small><br>
            <a class="button" href="${melhor.link}" target="_blank">Comprar</a>
        </div>
    `;

    // 🔥 comparação lado a lado
    data.forEach(p => {
        let lojasHTML = "";

        (p.comparison || []).forEach(l => {
            lojasHTML += `
                <div style="margin-top:5px; font-size:12px;">
                    <strong>${l.store}:</strong>
                    R$ ${l.price || "N/A"}
                    <a href="${l.link}" target="_blank">ver</a>
                </div>
            `;
        });

        grid.innerHTML += `
            <div class="card">
                <img src="${p.image || ''}">
                <div class="title">${p.title}</div>
                <div class="price">A partir de R$ ${p.bestPrice}</div>
                <small>${p.bestStore}</small>

                ${lojasHTML}

                <br>
                <a class="button" href="${p.link}" target="_blank">Ver melhor oferta</a>
            </div>
        `;
    });
}

/* filtro */
document.addEventListener("input", () => {
    if (!resultados.length) return;

    const min = Number(document.getElementById("min").value) || 0;
    const max = Number(document.getElementById("max").value) || 999999;

    const filtrado = resultados.filter(p =>
        (p.bestPrice || 0) >= min && (p.bestPrice || 0) <= max
    );

    renderizar(filtrado);
});
