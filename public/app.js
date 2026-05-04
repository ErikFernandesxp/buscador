const API_URL = "/search";

let resultados = [];

async function buscar() {
    const q = document.getElementById("busca").value;

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

    if (!data || !data.length) {
        grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
        return;
    }

    // 🔥 melhor oferta (menor preço real)
    const ordenado = [...data].sort((a, b) =>
        (Number(a.price) || 999999) - (Number(b.price) || 999999)
    );

    const melhor = ordenado[0];

    melhorDiv.innerHTML = `
        <div class="melhor-card">
            <h2>🔥 Melhor oferta</h2>
            <img src="${melhor.image || ''}">
            <p>${melhor.title || ''}</p>

            <p class="price">R$ ${melhor.price || 0}</p>

            <small>Loja: ${melhor.source || ''}</small>

            <br>

            <a class="button"
               href="${melhor.link && melhor.link !== '#' ? melhor.link : '#'}"
               target="_blank">
               Comprar
            </a>
        </div>
    `;

    // 🔥 GRID
    data.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.image || ''}">
                
                <div class="title">${p.title || ''}</div>

                <div class="price">R$ ${p.price || 0}</div>

                <small>Loja: ${p.source || ''}</small>

                <br>

                <a class="button"
                   href="${p.link && p.link !== '#' ? p.link : '#'}"
                   target="_blank">
                   Ver produto
                </a>
            </div>
        `;
    });
}

/* FILTRO DE PREÇO */
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
