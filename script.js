document.addEventListener('DOMContentLoaded', function () {
  const aviarioInput = document.getElementById('aviario');
  const pesoInput = document.getElementById('peso');
  const quantidadeInput = document.getElementById('quantidade');
  const adicionarBtn = document.getElementById('adicionar');
  const calcularBtn = document.getElementById('calcular');
  const limparBtn = document.getElementById('limpar');
  const salvarBtn = document.getElementById('salvar');
  const listaItens = document.getElementById('lista-itens');
  const resultadoDiv = document.getElementById('resultado');
  const itensSalvos = document.getElementById('itens-salvos');
  const tabAdicionados = document.getElementById('tab-adicionados');
  const tabSalvos = document.getElementById('tab-salvos');
  const abaAdicionados = document.getElementById('adicionados');
  const abaSalvos = document.getElementById('salvos');

  let itens = [];
  let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

  // Função para atualizar a lista de itens adicionados
  function atualizarLista() {
    listaItens.innerHTML = '';
    itens.forEach(function (item, index) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = `Aviário: ${item.aviario}, Peso: ${item.peso} kg × ${item.quantidade}`;

      const removerBtn = document.createElement('button');
      removerBtn.textContent = '×';
      removerBtn.className = 'remover-item';
      removerBtn.addEventListener('click', function () {
        itens.splice(index, 1);
        atualizarLista();
      });

      li.appendChild(span);
      li.appendChild(removerBtn);
      listaItens.appendChild(li);
    });
  }

  // Função para atualizar a lista de itens salvos, agrupados por data
  function atualizarItensSalvos() {
    itensSalvos.innerHTML = '';  // Limpar a lista de itens salvos

    // Agrupar os itens salvos por data
    const itensAgrupadosPorData = savedItems.reduce((acc, item) => {
      if (!acc[item.data]) {
        acc[item.data] = [];
      }
      acc[item.data].push(item);
      return acc;
    }, {});

    // Iterar sobre as datas agrupadas e exibir os itens
    for (const data in itensAgrupadosPorData) {
      const grupoData = itensAgrupadosPorData[data];
      const liData = document.createElement('li');
      liData.className = 'grupo-data';
      liData.textContent = `Data: ${data}`;
      itensSalvos.appendChild(liData);

      grupoData.forEach(function (item) {
        const liItem = document.createElement('li');
        liItem.className = 'item-salvo';
        liItem.innerHTML = `
          Aviário: ${item.aviario}, Peso Total: ${item.totalPeso} kg, Itens: ${item.totalItens}, Média: ${item.media.toFixed(2)}
          <button class="remover-item">×</button>
        `;
        
        const removerBtn = liItem.querySelector('button');
        removerBtn.addEventListener('click', function () {
          savedItems = savedItems.filter(savedItem => savedItem !== item);
          localStorage.setItem('savedItems', JSON.stringify(savedItems));
          atualizarItensSalvos();
        });

        itensSalvos.appendChild(liItem);
      });
    }
  }

  // Adicionar item
  adicionarBtn.addEventListener('click', function () {
    const aviario = aviarioInput.value.trim();
    const peso = parseFloat(pesoInput.value.replace(',', '.'));
    const quantidade = parseInt(quantidadeInput.value);

    if (!aviario) {
      alert('Por favor, insira o número do aviário!');
      aviarioInput.focus();
      return;
    }

    if (isNaN(peso)) {
      alert('Por favor, insira um peso válido!');
      pesoInput.focus();
      return;
    }

    if (isNaN(quantidade) || quantidade < 1) {
      alert('Por favor, insira uma quantidade válida!');
      quantidadeInput.focus();
      return;
    }

    itens.push({ aviario, peso, quantidade });
    atualizarLista();
    aviarioInput.value = '';
    pesoInput.value = '';
    quantidadeInput.value = '1';
    aviarioInput.focus();
  });

  // Calcular média
  calcularBtn.addEventListener('click', function () {
    if (itens.length === 0) {
      resultadoDiv.textContent = 'Adicione pelo menos um item para calcular a média.';
      return;
    }

    let totalPeso = 0;
    let totalQuantidade = 0;

    for (let i = 0; i < itens.length; i++) {
      totalPeso += itens[i].peso * itens[i].quantidade;
      totalQuantidade += itens[i].quantidade;
    }

    const media = totalPeso / totalQuantidade;

    resultadoDiv.innerHTML = `
      <strong>Total Peso:</strong> ${totalPeso.toFixed(2)} kg<br>
      <strong>Total Itens:</strong> ${totalQuantidade}<br>
      <hr>
      <strong>Média:</strong> ${media.toFixed(2)} kg
    `;
  });

  // Limpar tudo
  limparBtn.addEventListener('click', function () {
    itens = [];
    atualizarLista();
    resultadoDiv.textContent = '';
    aviarioInput.focus();
  });

  // Salvar itens
  salvarBtn.addEventListener('click', function () {
    const data = new Date().toISOString().split('T')[0];  // Data no formato YYYY-MM-DD
    const totalPeso = itens.reduce((acc, item) => acc + item.peso * item.quantidade, 0);
    const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);
    const media = totalPeso / totalItens;
    const aviario = itens[0].aviario;  // Pega o aviário do primeiro item

    savedItems.push({ aviario, data, totalPeso, totalItens, media });
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    atualizarItensSalvos();
    limparBtn.click(); // Limpa a lista de itens após salvar
  });

  // Alternar abas
  tabAdicionados.addEventListener('click', function () {
    abaAdicionados.style.display = 'block';
    abaSalvos.style.display = 'none';
    tabAdicionados.classList.add('active');
    tabSalvos.classList.remove('active');
  });

  tabSalvos.addEventListener('click', function () {
    abaAdicionados.style.display = 'none';
    abaSalvos.style.display = 'block';
    tabSalvos.classList.add('active');
    tabAdicionados.classList.remove('active');
  });

  // Inicializar
  atualizarLista();
  atualizarItensSalvos();
});
