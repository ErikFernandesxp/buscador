function renderizar(data) {
    const grid = document.getElementById("grid");
    const melhorDiv = document.getElementById("melhor");

    grid.innerHTML = "";
    melhorDiv.innerHTML = "";

    if (!data || !data.length) {
        grid.innerHTML = "<p>Nenhum resultado encontrado</p>";
        return;
    }

    // 🔥 melhor oferta global
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
            <small>${melhor.source || ''}</small><br>
            <a class="button" href="${melhor.link}" target="_blank">Comprar</a>
        </div>
    `;

    // 🔥 AGRUPAR POR PRODUTO (simples)
    data.forEach(p => {

        grid.innerHTML += `
            <div class="card">

                <img src="${p.image || ''}">

                <div class="title">${p.title || ''}</div>

                <div class="price">A partir de R$ ${p.price || 0}</div>

                <small>Loja principal: ${p.source || ''}</small>

                <table style="
                    width:100%;
                    margin-top:10px;
                    font-size:12px;
                    border-collapse: collapse;
                    color:#fff;
                ">
                    <tr style="border-bottom:1px solid #333;">
                        <th>Loja</th>
                        <th>Preço</th>
                        <th>Ação</th>
                    </tr>

                    <tr>
                        <td>${p.source || ''}</td>
                        <td>R$ ${p.price || 0}</td>
                        <td>
                            <a href="${p.link || '#'}" target="_blank">Ver</a>
                        </td>
                    </tr>
                </table>

                <br>

                <a class="button" href="${p.link}" target="_blank">
                    Ver melhor oferta
                </a>
            </div>
        `;
    });
}
