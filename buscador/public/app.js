let dados = [];

document.getElementById('range').oninput = function() {
  document.getElementById('valor').innerText = this.value;
  render();
};

async function buscar() {
  const q = document.getElementById('q').value;

  const res = await fetch(`/search?q=${q}`);
  dados = await res.json();

  render();
}

function render() {
  const max = document.getElementById('range').value;
  const div = document.getElementById('results');

  div.innerHTML = '';

  let filtrado = dados.filter(i => i.menorPreco <= max);

  filtrado.sort((a,b) => a.menorPreco - b.menorPreco);

  filtrado.forEach(i => {
    div.innerHTML += `
      <div class="card">
        <h3>${i.titulo}</h3>
        <p>🔥 R$ ${i.menorPreco}</p>
        <small>${i.source}</small><br>
        <a href="${i.link}" target="_blank">Comprar</a>
      </div>
    `;
  });
}