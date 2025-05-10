document.addEventListener('DOMContentLoaded', function () {
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

    let itens = JSON.parse(localStorage.getItem('itens')) || []; // Recupera os itens armazenados no localStorage
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || {};

    // Função para atualizar a lista de itens adicionados
    function atualizarLista() {
        listaItens.innerHTML = ''; // Limpa a lista

        itens.forEach(function (item, index) {
            const li = document.createElement('li');
            const span = document.createElement('span');

            // Exibe o peso e a quantidade
            span.innerHTML = `
                <strong>Peso:</strong> ${item.peso.toFixed(2)} kg<br>
                <strong>Quantidade:</strong> ${item.quantidade}
            `;

            const removerBtn = document.createElement('button');
            removerBtn.textContent = '×';
            removerBtn.className = 'remover-item';
            removerBtn.addEventListener('click', function () {
                itens.splice(index, 1);
                localStorage.setItem('itens', JSON.stringify(itens));
                atualizarLista();  // Atualiza a lista
            });

            li.appendChild(span);
            li.appendChild(removerBtn);
            listaItens.appendChild(li);
        });
    }

    // Função para atualizar a lista de itens salvos
    function atualizarItensSalvos() {
        itensSalvos.innerHTML = '';  // Limpa a lista

        // Iterar pelas datas no objeto savedItems
        Object.keys(savedItems).forEach(function (data) {
            // Exibe o título da data
            const dataTitulo = document.createElement('h3');
            dataTitulo.textContent = `Itens de ${data}`;
            itensSalvos.appendChild(dataTitulo);

            // Exibe os itens dessa data
            savedItems[data].forEach(function (item, index) {
                const li = document.createElement('li');
                const span = document.createElement('span');

                // Exibe o aviário, total de peso, total de quantidade e a média
                span.innerHTML = `
                    <strong>Aviário:</strong> ${item.aviario}<br>
                    <strong>Total Peso:</strong> ${item.totalPeso.toFixed(2)} kg<br>
                    <strong>Total Quantidade:</strong> ${item.totalQuantidade}<br>
                    <strong>Média:</strong> ${item.media.toFixed(2)} kg
                `;

                const removerBtn = document.createElement('button');
                removerBtn.textContent = '×';
                removerBtn.className = 'remover-item';
                removerBtn.addEventListener('click', function () {
                    // Remove o item da data específica
                    savedItems[data].splice(index, 1);
                    if (savedItems[data].length === 0) {
                        delete savedItems[data]; // Se não houver mais itens na data, apaga o grupo
                    }
                    localStorage.setItem('savedItems', JSON.stringify(savedItems));
                    atualizarItensSalvos();  // Atualiza a lista
                });

                li.appendChild(span);
                li.appendChild(removerBtn);
                itensSalvos.appendChild(li);
            });
        });
    }

    // Adicionar item
    adicionarBtn.addEventListener('click', function () {
        const peso = parseFloat(pesoInput.value.replace(',', '.'));
        const quantidade = parseInt(quantidadeInput.value);

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

        itens.push({ peso: peso, quantidade: quantidade });
        localStorage.setItem('itens', JSON.stringify(itens)); // Armazena os itens no localStorage
        atualizarLista();
        pesoInput.value = '';
        // quantidadeInput.value = '1'; // Comentado para manter a quantidade anterior
        pesoInput.focus();
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
            totalPeso += itens[i].peso;
            totalQuantidade += itens[i].quantidade;
        }

        const media = totalPeso / totalQuantidade;

        resultadoDiv.innerHTML = `
            <strong>Total Peso:</strong> ${totalPeso.toFixed(2)} kg<br>
            <strong>Total Quantidade:</strong> ${totalQuantidade}<br>
            <hr>
            <strong>Média:</strong> ${media.toFixed(2)} kg
        `;
    });

    // Limpar tudo
    limparBtn.addEventListener('click', function () {
        itens = [];
        localStorage.setItem('itens', JSON.stringify(itens)); // Limpa o localStorage
        atualizarLista();
        resultadoDiv.textContent = '';
        pesoInput.focus();
    });

    // Salvar itens
    salvarBtn.addEventListener('click', function () {
        const aviario = document.getElementById('aviario').value.trim();
        if (!aviario) {
            alert('Por favor, insira o número do aviário!');
            return;
        }

        const totalPeso = itens.reduce((acc, item) => acc + item.peso, 0);
        const totalQuantidade = itens.reduce((acc, item) => acc + item.quantidade, 0);
        const media = totalPeso / totalQuantidade;

        const dataAtual = new Date().toISOString().split('T')[0]; // Ex: 2025-05-10

        // Se não houver um grupo para a data, cria-se um novo
        if (!savedItems[dataAtual]) {
            savedItems[dataAtual] = [];
        }

        savedItems[dataAtual].push({
            aviario,
            totalPeso,
            totalQuantidade,
            media
        });

        localStorage.setItem('savedItems', JSON.stringify(savedItems));

        // Atualiza a lista de itens salvos
        atualizarItensSalvos();

        // Limpar os itens após salvar
        limparBtn.click();
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

    // Inicializar a lista de itens ao carregar a página
    atualizarLista();
    atualizarItensSalvos(); // Certifique-se de carregar os itens salvos
});
