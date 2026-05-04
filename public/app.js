const API_URL = "http://localhost:3000/search"; // ALTERE AQUI

async function buscar() {
    const q = document.getElementById("busca").value;

    if (!q) return;

    const res = await fetch(`${API_URL}?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    const grid = document.getElementById("grid");
    const melhorDiv = document.getElementById("melhor");

    grid.innerHTML = "";
    melhorDiv.innerHTML = "";

    if (data.length === 0) {
        grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
        return;
    }

    // MELHOR
    const melhor = data[0];

    melhorDiv.innerHTML = `
        <div class="melhor-card">
            <h2>🔥 Melhor oferta</h2>
            <img src="${melhor.image}">
            <p>${melhor.title}</p>
            <p class="price">R$ ${melhor.price}</p>
            <a class="button" href="${melhor.link}" target="_blank">Comprar</a>
        </div>
    `;

    // GRID
    data.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.image}">
                <div class="title">${p.title}</div>
                <div class="price">R$ ${p.price}</div>
                <small>${p.source}</small><br>
                <a class="button" href="${p.link}" target="_blank">Ver</a>
            </div>
        `;
    });
}